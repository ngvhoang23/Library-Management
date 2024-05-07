import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Button,
  TextInput,
  View,
  Text,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Image,
  Pressable,
  ImageBackground,
} from "react-native";
import { globalStyles } from "../../styles/global.js";
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
import moment from "moment";

const formSchema = yup.object({
  birth_date: yup
    .string()
    .required()
    .test("older than 17", "Age must be from 18 to 55", (val) => {
      const year = val.split("-")[0];
      const currentYear = new Date().getFullYear();
      age = currentYear - year;
      return age >= 18 && age <= 55;
    }),
  first_name: yup.string().trim().required(),
  last_name: yup.string().trim().required(),
  email_address: yup.string().test("email pattern", "Enter a valid email address", (val) => {
    if (!val) {
      return true;
    } else {
      return validateEmail(val);
    }
  }),
  phone_num: yup.string().test("phone number pattern", "Invalid phone number", (val) => {
    return new RegExp(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/).test(val);
  }),
});

function EditReaderScreen({ route, navigation }) {
  const { reader_info } = route.params;
  const {
    user_id,
    user_avatar,
    phone_num,
    birth_date,
    created_at,
    email_address,
    address,
    gender,
    reader_type,
    first_name,
    last_name,
  } = reader_info;
  const [avatar, setAvatar] = useState();
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [isShowStartDatePicker, setIsShowStartDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });

  const pickImage = async () => {
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setIsLoading(false);

    if (!result.canceled) {
      setAvatar(result.assets[0]);
    }
  };

  const trySubmit = (readerInfo) => {
    const { phone_num, birth_date, email_address, gender, first_name, last_name, address } = readerInfo;
    setIsLoading(true);
    const formData = new FormData();

    if (!user_id) {
      return;
    }

    if (avatar?.uri) {
      formData.append("avatar", {
        uri: avatar.uri,
        name: "reader-avatar",
        type: avatar.mimeType,
      });
    }

    user_id && formData.append("user_id", user_id);
    phone_num && formData.append("phone_num", phone_num.trim());
    birth_date && formData.append("birth_date", birth_date);
    formData.append("email_address", email_address.trim());
    address && formData.append("address", address.trim());
    formData.append("gender", gender.value);
    first_name && formData.append("first_name", first_name.trim());
    last_name && formData.append("last_name", last_name.trim());

    return new Promise((resolve, reject) => {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const configurations = {
            method: "PUT",
            url: `http://10.0.2.2:5000/users/reader`,
            data: formData,
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${access_token}`,
            },
          };

          axios(configurations)
            .then((result) => {
              resolve(result);
            })
            .catch((err) => {
              reject(err);
              console.log("err", err);
            });
        })
        .catch((err) => {
          reject(err);
          console.log(err);
        });
    });
  };

  const handleSubmit = (readerInfo) => {
    trySubmit(readerInfo)
      .then((result) => {
        navigation.navigate("Reader Detail", { reader_info: { user_id: user_id } });
        setResultStatus({ isSuccess: 1, visible: true });
      })
      .catch((err) => {
        if (err?.message === "Network Error") {
          trySubmit(readerInfo)
            .then((result) => {
              navigation.navigate("Reader Detail", { reader_info: { user_id: user_id } });
              setResultStatus({ isSuccess: 1, visible: true });
            })
            .catch((err) => {
              setResultStatus({ isSuccess: 0, visible: true });
            });
          console.log(err);
        }
      })
      .finally((result) => {
        setIsLoading(false);
      });
  };

  return (
    <ImageBackground source={require("../../assets/images/page_bg2.jpg")} style={styles.wrapper}>
      <Formik
        initialValues={{
          phone_num: phone_num || "",
          birth_date: new Date(birth_date).toISOString().split("T")[0],
          email_address: email_address || "",
          address: address || "",
          gender: { value: gender, index: gender === 0 ? 1 : 0 },
          first_name: first_name || "",
          last_name: last_name || "",
        }}
        validationSchema={formSchema}
        onSubmit={(values, actions) => {
          handleSubmit(values);
        }}
      >
        {(props) => (
          <TouchableOpacity style={styles.formWrapper} activeOpacity={1.0} onPress={Keyboard.dismiss}>
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <AvatarPicker
                _styles={styles.avatarPicker}
                avatar={avatar}
                initAvatar={`http://10.0.2.2:5000${user_avatar}`}
                setAvatar={setAvatar}
                onPickImage={pickImage}
              />

              <InputItem
                _styles={[styles.input]}
                placeholder="Số điện thoại"
                lableTitle="Số điện thoại"
                onChange={props.handleChange("phone_num")}
                value={props.values.phone_num}
                errorText={props.errors.phone_num}
              />
              <MyDateTimePicker
                _styles={[styles.input]}
                lableTitle="Ngày sinh"
                value={props.values.birth_date}
                errorText={props.errors.birth_date}
                onPress={() => setIsShowDatePicker(true)}
              />
              {isShowDatePicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={new Date(birth_date)}
                  onChange={(event, selectedDate) => {
                    setIsShowDatePicker(false);
                    props.setFieldValue("birth_date", selectedDate.toISOString().split("T")[0]);
                  }}
                />
              )}

              <InputItem
                _styles={[styles.input]}
                placeholder="Email"
                lableTitle="Email"
                onChange={props.handleChange("email_address")}
                value={props.values.email_address}
                errorText={props.errors.email_address}
              />

              <InputItem
                _styles={[styles.input]}
                placeholder="Địa chỉ"
                lableTitle="Địa chỉ"
                onChange={props.handleChange("address")}
                value={props.values.address}
                errorText={props.errors.address}
              />

              <MenuPickers
                _styles={[styles.input]}
                lableTitle="Giới tính"
                initIndex={gender === 0 ? 1 : 0}
                value={props.values.gender}
                errorText={props.errors.gender}
                options={[
                  { title: "Male", value: 1 },
                  { title: "Female", value: 0 },
                ]}
                onChange={(selectedValue, selectedIndex) => {
                  props.setFieldValue("gender", { value: selectedValue, index: selectedIndex });
                }}
              />

              <InputItem
                _styles={[styles.input]}
                placeholder="Họ"
                lableTitle="Họ"
                onChange={props.handleChange("first_name")}
                value={props.values.first_name}
                errorText={props.errors.first_name}
              />
              <InputItem
                _styles={[styles.input]}
                placeholder="Tên và tên đệm"
                lableTitle="Tên và tên đệm"
                onChange={props.handleChange("last_name")}
                value={props.values.last_name}
                errorText={props.errors.last_name}
              />
              <FlatButton
                _styles={styles.submitBtn}
                onPress={props.handleSubmit}
                text="Chỉnh sửa"
                fontSize={normalize(10)}
              />
            </ScrollView>
          </TouchableOpacity>
        )}
      </Formik>
      <LoadingModal visible={isLoading} />
      <AlertModal
        onClose={() => setResultStatus({ isSuccess: 0, visible: false })}
        isSuccess={resultStatus?.isSuccess}
        visible={resultStatus?.visible ? true : false}
      />
    </ImageBackground>
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

  headerTitle: {
    fontFamily: "nunito-medium",
    fontSize: normalize(18),
    width: "100%",
    marginLeft: normalize(40),
  },

  avatarPicker: {
    width: "100%",
    borderRadius: normalize(10),
    marginBottom: normalize(10),
  },

  formWrapper: {
    width: "100%",
    marginTop: normalize(10),
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingLeft: normalize(20),
    paddingRight: normalize(20),
  },

  formContainer: {
    width: "100%",
    height: normalize(640),
    flex: 1,
  },

  input: {
    marginBottom: normalize(20),
    width: "100%",
  },

  submitBtn: {
    width: "100%",
    height: normalize(32),
    borderRadius: normalize(40),
    marginBottom: normalize(12),
    paddingVertical: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c60ff",
  },
});

export default EditReaderScreen;
