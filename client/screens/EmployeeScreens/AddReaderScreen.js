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

const formSchema = yup.object({
  user_name: yup.string().trim().required(),
  password: yup
    .string()
    .trim()
    .required()
    .test("", "Password should contains atleast 8 charaters and containing uppercase,lowercase and numbers", (val) => {
      return new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).test(val);
    }),
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

function AddReaderScreen({ navigation }) {
  const [avatar, setAvatar] = useState();
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [isShowStartDatePicker, setIsShowStartDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0]);
    }
  };

  const trySubmit = (readerInfo) => {
    const {
      user_name,
      password,
      phone_num,
      birth_date,
      email_address,
      gender,
      first_name,
      last_name,
      address,
      start_date,
      reader_type,
    } = readerInfo;

    const start_date_formated = new Date(start_date);

    const expired_date = new Date(start_date_formated.setMonth(start_date_formated.getMonth() + 6));

    setIsLoading(true);
    const formData = new FormData();

    avatar &&
      formData.append("avatar", {
        uri: avatar.uri,
        name: "reader-avatar",
        type: avatar.mimeType,
      });

    formData.append("user_name", user_name.trim());
    formData.append("password", password.trim());
    phone_num && formData.append("phone_num", phone_num.trim());
    birth_date && formData.append("birth_date", birth_date);
    start_date && formData.append("created_at", start_date);
    expired_date && formData.append("expired_date", expired_date.toISOString().split("T")[0]);
    email_address && formData.append("email_address", email_address.trim());
    address && formData.append("address", address.trim());
    formData.append("gender", gender?.value);
    formData.append("reader_type", reader_type?.value);
    first_name && formData.append("first_name", first_name.trim());
    last_name && formData.append("last_name", last_name.trim());

    return new Promise((resolve, reject) => {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const configurations = {
            method: "POST",
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
              if (err?.response?.data?.code === "ER_DUP_ENTRY") {
                alert("Duplicate User Name");
                setIsLoading(false);
              } else {
                reject(err);
              }
              console.log("err", err);
            });
        })
        .catch((err) => {
          reject(err);
          console.log(err);
        });
    });
  };

  const handleSubmit = (readerInfo, resetForm) => {
    trySubmit(readerInfo)
      .then((result) => {
        resetForm();
        navigation.navigate("Dashboard", { screen: "Readers" });
        setResultStatus({ isSuccess: 1, visible: true });
      })
      .catch((err) => {
        console.log(err);
        if (err?.message === "Network Error") {
          trySubmit(readerInfo)
            .then((result) => {
              resetForm();
              navigation.navigate("Dashboard", {
                screen: "Readers",
              });
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
    <ImageBackground source={require("../../assets/images/page_bg3.jpg")} style={styles.wrapper}>
      <Formik
        initialValues={{
          user_name: "",
          password: "",
          phone_num: "",
          email_address: "",
          birth_date: new Date().toISOString().split("T")[0],
          start_date: new Date().toISOString().split("T")[0],
          gender: { value: 1, index: 0 },
          reader_type: { value: "student", index: 0 },
          first_name: "",
          last_name: "",
          address: "",
        }}
        validationSchema={formSchema}
        onSubmit={(values, actions) => {
          const resetForm = () => {
            setAvatar();
            actions.resetForm();
          };
          handleSubmit(values, resetForm);
        }}
      >
        {(props) => (
          <TouchableOpacity style={styles.formWrapper} activeOpacity={1.0} onPress={Keyboard.dismiss}>
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <AvatarPicker
                _styles={styles.avatarPicker}
                avatar={avatar}
                setAvatar={setAvatar}
                onPickImage={pickImage}
                title={"Select Cover Photo"}
              />
              <InputItem
                _styles={[styles.input]}
                placeholder="User Name"
                lableTitle="User Name"
                onChange={props.handleChange("user_name")}
                value={props.values.user_name}
                errorText={props.errors.user_name}
              />
              <InputItem
                _styles={[styles.input]}
                placeholder="Password"
                lableTitle="Password"
                onChange={props.handleChange("password")}
                value={props.values.password}
                errorText={props.errors.password}
              />
              <InputItem
                _styles={[styles.input]}
                placeholder="Phone Number"
                lableTitle="Phone Number"
                onChange={props.handleChange("phone_num")}
                value={props.values.phone_num}
                errorText={props.errors.phone_num}
              />
              <MyDateTimePicker
                _styles={[styles.input]}
                lableTitle="Birth Date"
                value={props.values.birth_date}
                errorText={props.errors.birth_date}
                onPress={() => setIsShowDatePicker(true)}
              />
              {isShowDatePicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={new Date(props.values.birth_date)}
                  onChange={(event, selectedDate) => {
                    setIsShowDatePicker(false);
                    props.setFieldValue("birth_date", selectedDate.toISOString().split("T")[0]);
                  }}
                />
              )}

              <MyDateTimePicker
                _styles={[styles.input]}
                lableTitle="Start Date"
                value={props.values.start_date}
                errorText={props.errors.start_date}
                onPress={() => setIsShowStartDatePicker(true)}
              />
              {isShowStartDatePicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={new Date(props.values.start_date)}
                  onChange={(event, selectedDate) => {
                    setIsShowStartDatePicker(false);
                    props.setFieldValue("start_date", selectedDate.toISOString().split("T")[0]);
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
                placeholder="Address"
                lableTitle="Address"
                onChange={props.handleChange("address")}
                value={props.values.address}
                errorText={props.errors.address}
              />

              <MenuPickers
                _styles={[styles.input]}
                lableTitle="Gender"
                initIndex={0}
                value={props.values.gender}
                errorText={props.errors.gender}
                options={[
                  { title: "Male", value: 1 },
                  { title: "Female", value: 0 },
                ]}
                onChange={(selectedValue, selectedIndex) =>
                  props.setFieldValue("gender", { value: selectedValue, index: selectedIndex })
                }
              />

              <MenuPickers
                _styles={[styles.input]}
                lableTitle="Reader type"
                initIndex={0}
                value={props.values.reader_type}
                errorText={props.errors.reader_type}
                options={[
                  { title: "Student", value: "student" },
                  { title: "Lecturer", value: "lecturer" },
                ]}
                onChange={(selectedValue, selectedIndex) =>
                  props.setFieldValue("reader_type", { value: selectedValue, index: selectedIndex })
                }
              />

              <InputItem
                _styles={[styles.input]}
                placeholder="First Name"
                lableTitle="First Name"
                onChange={props.handleChange("first_name")}
                value={props.values.first_name}
                errorText={props.errors.first_name}
              />
              <InputItem
                _styles={[styles.input]}
                placeholder="Last Name"
                lableTitle="Last Name"
                onChange={props.handleChange("last_name")}
                value={props.values.last_name}
                errorText={props.errors.last_name}
              />
              <FlatButton
                _styles={styles.submitBtn}
                onPress={props.handleSubmit}
                text="Submit"
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
    backgroundColor: "#6c60ff",
    borderRadius: normalize(1000),
  },
});

export default AddReaderScreen;