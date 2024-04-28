import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Text,
  Button,
  ImageBackground,
  Image,
} from "react-native";
import { Formik } from "formik";
import FlatButton from "../../shared/FlatButton.js";
import * as yup from "yup";
import InputItem from "../../components/InputItem.js";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AvatarPicker from "../../components/AvatarPicker.js";
import DateTimePicker from "@react-native-community/datetimepicker";
import MyDateTimePicker from "../../components/MyDateTimePicker.js";
import { Picker } from "@react-native-picker/picker";
import MenuPickers from "../../components/MenuPicker.js";
import LoadingModal from "../../components/LoadingModal.js";
import AlertModal from "../../components/AlertModal.js";
import { _retrieveData, normalize, validateEmail } from "../../defined_function/index.js";
import { useIsFocused } from "@react-navigation/native";
import BriefBookInfoPreview from "../../components/BriefBookInfoPreview.js";
import PickerBtn from "../../components/PickerBtn.js";
import PickerModal from "../../components/PickerModal";

const formSchema = yup.object({
  position: yup.object().test("", "Book positions cannot be left blank", (val) => {
    return val?.shelf && val?.row && val?.order;
  }),
});

function AddBookScreen({ route, navigation }) {
  const { book_detail_info } = route.params;
  const { book_detail_id, book_name, author_name, cover_photo, description } = book_detail_info;
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });
  const [searchResult, setSearchResult] = useState();
  const isFocused = useIsFocused();

  const handleSubmit = (bookInfo) => {
    const { import_date, position } = bookInfo;

    // setIsLoading(true);

    if (!book_detail_id) {
      alert("Select book group to continue");
      return;
    }

    const formatedPosition = `${position.shelf}-${position.row}-${position.order}`;

    const data = {
      book_detail_id: book_detail_id,
      position: formatedPosition,
      import_date,
    };

    _retrieveData("ACCESS_TOKEN")
      .then((access_token) => {
        const configurations = {
          method: "POST",
          url: `http://10.0.2.2:5000/books/`,
          data: data,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        };

        axios(configurations)
          .then((result) => {
            setResultStatus({ isSuccess: 1, visible: true });
            navigation.goBack();
          })
          .catch((err) => {
            setResultStatus({ isSuccess: 0, visible: true });
            if (err?.response?.data?.code === "ER_DUP_ENTRY") {
              alert("This position contained another book");
            }
            console.log("err", err);
          })
          .finally((result) => {
            setIsLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally((result) => {
        setIsLoading(false);
      });
  };

  return (
    <TouchableOpacity style={styles.wrapper} activeOpacity={1}>
      {book_detail_info && (
        <ImageBackground source={require("../../assets/images/page_bg.jpg")} style={[styles.headerWrapper]}>
          <View style={[styles.headerContainer]}>
            <View style={[styles.bookInfo, styles.elevation]}>
              <Text style={styles.bookNameHeader} numberOfLines={3}>
                {book_name}
              </Text>
              {author_name && <Text style={styles.authorNameHeader}>by {author_name}</Text>}
              {description && (
                <Text style={styles.desContent} numberOfLines={3}>
                  {description}
                </Text>
              )}
            </View>
            <View style={styles.bookCoverPhoto}>
              <Image source={{ uri: `http://10.0.2.2:5000/${cover_photo}` }} style={styles.avatarPreview} />
            </View>
          </View>
        </ImageBackground>
      )}

      <Formik
        initialValues={{
          import_date: new Date().toISOString().split("T")[0],
          position: { shelf: "", row: "", order: "" },
        }}
        validationSchema={formSchema}
        onSubmit={(values, actions) => {
          handleSubmit(values);
        }}
      >
        {(props) => (
          <TouchableOpacity style={styles.formWrapper} activeOpacity={1.0} onPress={Keyboard.dismiss}>
            <ScrollView
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <MyDateTimePicker
                _styles={[styles.input]}
                lableTitle="Import Date"
                value={props.values.import_date}
                errorText={props.errors.import_date}
                onPress={() => setIsShowDatePicker(true)}
              />
              {isShowDatePicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={new Date(props.values.import_date)}
                  onChange={(event, selectedDate) => {
                    setIsShowDatePicker(false);
                    props.setFieldValue("import_date", selectedDate.toISOString().split("T")[0]);
                  }}
                />
              )}

              <InputItem
                _styles={[styles.input, styles.position]}
                placeholder="Shelf"
                lableTitle="Shelf"
                onChange={(val) => props.setFieldValue("position", { ...props.values.position, shelf: val })}
                value={props.values.position?.shelf}
              />

              <InputItem
                _styles={[styles.input, styles.position]}
                placeholder="Row"
                lableTitle="Row"
                onChange={(val) => props.setFieldValue("position", { ...props.values.position, row: val })}
                value={props.values.position?.row}
              />

              <InputItem
                _styles={[styles.input, styles.position]}
                placeholder="Order"
                lableTitle="Order"
                onChange={(val) => props.setFieldValue("position", { ...props.values.position, order: val })}
                value={props.values.position?.order}
              />

              {props.errors.position && <Text style={styles.positionValidate}>{props.errors.position}</Text>}
            </ScrollView>
            <FlatButton
              _styles={styles.submitBtn}
              onPress={props.handleSubmit}
              text="submit"
              fontSize={normalize(10)}
            />
          </TouchableOpacity>
        )}
      </Formik>
      <LoadingModal visible={isLoading} />
      <AlertModal
        onClose={() => setResultStatus({ isSuccess: 0, visible: false })}
        isSuccess={resultStatus?.isSuccess}
        visible={resultStatus?.visible ? true : false}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },

  headerWrapper: {
    flex: 1,
    marginBottom: normalize(0),
  },

  headerContainer: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    position: "relative",
    marginTop: normalize(10),
    padding: normalize(10),
    paddingLeft: normalize(20),
    paddingTop: normalize(20),
    paddingBottom: normalize(30),
  },

  bookCoverPhoto: {
    marginRight: normalize(10),
  },

  avatarPreview: {
    width: normalize(100),
    height: normalize(140),
    borderRadius: normalize(8),
  },

  bookInfo: {
    width: "50%",
    borderRadius: normalize(10),
  },

  bookNameHeader: {
    fontFamily: "nunito-bold",
    fontSize: normalize(18),
    letterSpacing: normalize(2),
    color: "#3c3c3c",
  },

  authorNameHeader: {
    width: "100%",
    fontFamily: "nunito-medium",
    fontSize: normalize(10),
    letterSpacing: normalize(2),
    marginBottom: normalize(4),
    color: "#6c60ff",
  },

  desContent: {
    fontFamily: "nunito-medium",
    fontSize: normalize(10),
    color: "#676768",
    marginTop: normalize(6),
  },

  selectBookBtn: {
    marginTop: 30,
  },

  headerTitle: {
    fontFamily: "nunito-medium",
    fontSize: normalize(18),
    width: "100%",
    marginLeft: normalize(40),
  },

  formWrapper: {
    width: "100%",
    marginTop: normalize(10),
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },

  formContainer: {
    width: "86%",
    height: normalize(640),
    flex: 1,
  },

  input: {
    marginBottom: normalize(20),
    width: "100%",
  },

  position: {
    marginRight: normalize(20),
    width: "20%",
  },

  submitBtn: {
    width: "90%",
    height: normalize(32),

    marginTop: normalize(6),
    marginBottom: normalize(16),
    paddingVertical: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e74fd",
  },
});

export default AddBookScreen;