import React, { useEffect, useRef, useState } from "react";
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
import { useIsFocused } from "@react-navigation/native";

const formSchema = yup.object({
  book_name: yup.string().trim().required(),
  price: yup.string().trim().required(),
  published_date: yup
    .string()
    .required()
    .test("", "Only accept books published within 8 years", (val) => {
      const year = val.split("-")[0];
      const currentYear = new Date().getFullYear();
      return currentYear - year <= 8;
    }),
});

function EditBookGroupScreen({ route, navigation }) {
  const { book_info } = route.params;
  const {
    book_detail_id,
    book_name,
    price,
    published_date,
    description,
    publish_com,
    author_id,
    author_name,
    category_id,
    category_name,
    cover_photo,
  } = book_info;
  const [coverPhoto, setCoverPhoto] = useState();
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const category_config = {
            headers: { Authorization: `Bearer ${access_token}` },
          };
          axios
            .get(`http://10.0.2.2:5000/books/categories`, category_config)
            .then((result) => {
              setCategories([...result.data]);
            })
            .catch((error) => {
              console.log(error);
            });
          const author_config = {
            headers: { Authorization: `Bearer ${access_token}` },
          };
          axios
            .get(`http://10.0.2.2:5000/books/authors`, author_config)
            .then((result) => {
              setAuthors([...result.data]);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isFocused]);

  const pickImage = async () => {
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 6],
      quality: 1,
    });
    setIsLoading(false);

    if (!result.canceled) {
      setCoverPhoto(result.assets[0]);
    }
  };

  const trySubmit = (bookInfo) => {
    const { book_name, price, published_date, description, publish_com, author, category } = bookInfo;

    if (!book_detail_id) {
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    if (coverPhoto) {
      formData.append("cover-photo", {
        uri: coverPhoto.uri,
        name: "cover-photo",
        type: coverPhoto.mimeType,
      });
    }

    formData.append("book_detail_id", book_detail_id);
    formData.append("book_name", book_name.trim());
    formData.append("price", price.trim());
    formData.append("published_date", published_date);
    description && formData.append("description", description);
    publish_com && formData.append("publish_com", publish_com.trim());
    formData.append("author_id", author?.author_id);
    formData.append("category_id", category?.category_id);

    return new Promise((resolve, reject) => {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const configurations = {
            method: "PUT",
            url: `http://10.0.2.2:5000/books/book-groups`,
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
          console.log(err);
        });
    });
  };

  const handleSubmit = (bookInfo) => {
    trySubmit(bookInfo)
      .then((result) => {
        navigation.navigate("Book Group Detail", { book_info: { book_detail_id } });
        setResultStatus({ isSuccess: 1, visible: true });
      })
      .catch((err) => {
        console.log(err);
        if (err?.message === "Network Error") {
          trySubmit(bookInfo)
            .then((result) => {
              navigation.navigate("Book Group Detail", { book_info: { book_detail_id } });
              setResultStatus({ isSuccess: 1, visible: true });
            })
            .catch((err) => {
              setResultStatus({ isSuccess: 0, visible: true });
            })
            .finally((result) => {
              setIsLoading(false);
            });
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
          book_name: book_name,
          price: price.toString(),
          published_date: new Date(published_date).toISOString().split("T")[0],
          description: description,
          publish_com: publish_com,
          author: { author_id, author_name },
          category: { category_id, category_name },
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
                avatar={coverPhoto}
                setAvatar={setCoverPhoto}
                initAvatar={`http://10.0.2.2:5000${cover_photo}`}
                onPickImage={pickImage}
                title={"Chọn bìa sách"}
              />

              <InputItem
                _styles={[styles.input]}
                placeholder="Tên sách"
                lableTitle="Tên sách"
                multiline
                onChange={props.handleChange("book_name")}
                value={props.values.book_name}
                errorText={props.errors.book_name}
              />
              <InputItem
                _styles={[styles.input]}
                placeholder="Giá"
                lableTitle="Giá"
                onChange={props.handleChange("price")}
                value={props.values.price.toString()}
                errorText={props.errors.price}
                numberOnly
              />

              <MyDateTimePicker
                _styles={[styles.input]}
                lableTitle="Ngày xuất bản"
                value={props.values.published_date}
                errorText={props.errors.published_date}
                onPress={() => setIsShowDatePicker(true)}
              />
              {isShowDatePicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={new Date(props.values.published_date)}
                  onChange={(event, selectedDate) => {
                    setIsShowDatePicker(false);
                    props.setFieldValue("published_date", selectedDate.toISOString().split("T")[0]);
                  }}
                />
              )}

              <InputItem
                _styles={[styles.input]}
                placeholder="Mô tả"
                lableTitle="Mô tả"
                multiline
                onChange={props.handleChange("description")}
                value={props.values.description}
                errorText={props.errors.description}
                numberOfLines={4}
              />

              <InputItem
                _styles={[styles.input]}
                placeholder="Nhà xuất bản"
                lableTitle="Nhà xuất bản"
                onChange={props.handleChange("publish_com")}
                value={props.values.publish_com}
                errorText={props.errors.publish_com}
              />

              <MenuPickers
                _styles={[styles.input]}
                lableTitle="Tác giả"
                initIndex={authors?.findIndex((author) => author.author_id === author_id)}
                errorText={props.errors.author}
                options={authors?.map((author) => {
                  return { title: author.author_name, value: author.author_id };
                })}
                onChange={(selectedValue, selectedIndex) => props.setFieldValue("author", authors[selectedIndex])}
              />

              <MenuPickers
                _styles={[styles.input]}
                lableTitle="Danh mục"
                initIndex={categories?.findIndex((category) => category.category_id === category_id)}
                errorText={props.errors.category}
                options={categories?.map((category) => {
                  return { title: category.category_name, value: category.category_id };
                })}
                onChange={(selectedValue, selectedIndex) => props.setFieldValue("category", categories[selectedIndex])}
              />
              <FlatButton
                _styles={styles.submitBtn}
                onPress={props.handleSubmit}
                text="Sửa nhóm sách"
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
    marginBottom: normalize(20),
  },

  formWrapper: {
    width: "100%",
    marginTop: normalize(20),
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },

  formContainer: {
    width: "90%",
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

export default EditBookGroupScreen;
