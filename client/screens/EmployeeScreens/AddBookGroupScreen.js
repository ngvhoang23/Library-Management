import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, ScrollView, Keyboard, TouchableOpacity, Text, ImageBackground } from "react-native";
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
import { useNavigation } from "@react-navigation/native";

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

function AddBookGroupScreen({ navigation }) {
  const [coverPhoto, setCoverPhoto] = useState();
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [isShowStartDatePicker, setIsShowStartDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const isFocused = useIsFocused();

  const _navigation = useNavigation();

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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCoverPhoto(result.assets[0]);
    }
  };

  const trySubmit = (bookInfo) => {
    const { book_name, price, published_date, description, publish_com, author, category, for_reader } = bookInfo;

    setIsLoading(true);
    const formData = new FormData();

    coverPhoto &&
      formData.append("cover-photo", {
        uri: coverPhoto.uri,
        name: "cover-photo",
        type: coverPhoto.mimeType,
      });

    formData.append("book_name", book_name.trim());
    formData.append("price", price.trim());
    formData.append("published_date", published_date);
    description && formData.append("description", description);
    publish_com && formData.append("publish_com", publish_com.trim());
    formData.append("author_id", author?.author_id);
    formData.append("category_id", category?.category_id);
    formData.append("for_reader", for_reader);
    return new Promise((resolve, reject) => {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const configurations = {
            method: "POST",
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
        navigation.navigate("Dashboard", { screen: "Book Groups" });
        setResultStatus({ isSuccess: 1, visible: true });
      })
      .catch((err) => {
        console.log(err);
        if (err?.message === "Network Error") {
          trySubmit(bookInfo)
            .then((result) => {
              navigation.navigate("Dashboard", { screen: "Book Groups" });
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
    <ImageBackground source={require("../../assets/images/page_bg2.jpg")} resizeMode="cover" style={styles.wrapper}>
      {categories.length > 0 && authors.length > 0 && (
        <Formik
          initialValues={{
            book_name: "",
            price: "",
            published_date: new Date().toISOString().split("T")[0],
            description: "",
            publish_com: "",
            author: authors[0],
            category: categories[0],
            for_reader: 1,
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
                <AvatarPicker
                  _styles={styles.avatarPicker}
                  avatar={coverPhoto}
                  setAvatar={setCoverPhoto}
                  onPickImage={pickImage}
                  title={"Choose cover photo"}
                />

                <InputItem
                  _styles={[styles.input]}
                  placeholder="Book name"
                  lableTitle="Book name"
                  onChange={props.handleChange("book_name")}
                  value={props.values.book_name}
                  errorText={props.errors.book_name}
                />

                <InputItem
                  _styles={[styles.input]}
                  placeholder="Price"
                  lableTitle="Price"
                  onChange={(value) => {
                    props.setFieldValue("price", value.replace(/[^0-9]/g, ""));
                  }}
                  value={props.values.price}
                  errorText={props.errors.price}
                  numberOnly
                />

                <MyDateTimePicker
                  _styles={[styles.input]}
                  lableTitle="Published date"
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
                  placeholder="Description"
                  lableTitle="Description"
                  multiline
                  onChange={props.handleChange("description")}
                  value={props.values.description}
                  errorText={props.errors.description}
                  numberOfLines={4}
                />

                <InputItem
                  _styles={[styles.input]}
                  placeholder="Publish Comany"
                  lableTitle="Publish Comany"
                  onChange={props.handleChange("publish_com")}
                  value={props.values.publish_com}
                  errorText={props.errors.publish_com}
                />

                <MenuPickers
                  _styles={[styles.input]}
                  initIndex={0}
                  lableTitle="For reader"
                  errorText={props.errors.for_reader}
                  options={[
                    { title: "Student", value: 1 },
                    { title: "Lecturer", value: 2 },
                    { title: "All", value: 3 },
                  ]}
                  onChange={(selectedValue, selectedIndex) => props.setFieldValue("for_reader", selectedValue)}
                />

                <MenuPickers
                  _styles={[styles.input]}
                  initIndex={0}
                  lableTitle="Author"
                  errorText={props.errors.author}
                  options={authors?.map((author) => {
                    return { title: author.author_name, value: author.author_id };
                  })}
                  onChange={(selectedValue, selectedIndex) => props.setFieldValue("author", authors[selectedIndex])}
                />

                <MenuPickers
                  _styles={[styles.input]}
                  initIndex={0}
                  lableTitle="Category"
                  errorText={props.errors.category}
                  options={categories?.map((category) => {
                    return { title: category.category_name, value: category.category_id };
                  })}
                  onChange={(selectedValue, selectedIndex) =>
                    props.setFieldValue("category", categories[selectedIndex])
                  }
                />

                <FlatButton
                  _styles={styles.submitBtn}
                  onPress={props.handleSubmit}
                  text="submit"
                  fontSize={normalize(10)}
                />
              </ScrollView>
            </TouchableOpacity>
          )}
        </Formik>
      )}
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
    marginBottom: 0,
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "scroll",
  },

  formContainer: {
    width: "90%",
  },

  input: {
    marginBottom: normalize(20),
    width: "100%",
  },

  submitBtn: {
    width: "100%",
    height: normalize(32),

    marginTop: normalize(6),
    marginBottom: normalize(16),
    paddingVertical: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e74fd",
  },

  position: {
    marginRight: normalize(20),
    width: "20%",
  },
});

export default AddBookGroupScreen;