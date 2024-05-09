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
import { useUserInfoContext } from "../../context/userInfoContext.js";
import { text } from "@fortawesome/fontawesome-svg-core";

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

function EditProfileScreen({ route, navigation }) {
  const [avatar, setAvatar] = useState();
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });

  const { user, setUser } = useUserInfoContext();

  const { user_avatar, phone_num, birth_date, address, gender, first_name, last_name, email_address } = user;

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

  const trySubmit = (userInfo) => {
    const { phone_num, birth_date, gender, first_name, last_name, address } = userInfo;
    setIsLoading(true);
    const formData = new FormData();

    if (avatar?.uri) {
      formData.append("avatar", {
        uri: avatar.uri,
        name: "reader-avatar",
        type: avatar.mimeType,
      });
    }

    phone_num && formData.append("phone_num", phone_num.trim());
    birth_date && formData.append("birth_date", birth_date);
    address && formData.append("address", address.trim());
    formData.append("gender", gender.value);
    first_name && formData.append("first_name", first_name.trim());
    last_name && formData.append("last_name", last_name.trim());

    return new Promise((resolve, reject) => {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const configurations = {
            method: "PUT",
            url: `http://10.0.2.2:5000/users/user-info`,
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
            });
        })
        .catch((err) => {
          reject(err);
          console.log(err);
        });
    });
  };

  const handleSubmit = (userInfo) => {
    trySubmit(userInfo)
      .then((result) => {
        getNewUserInfo().then((result) => {
          navigation.navigate("Profile");
          setResultStatus({ isSuccess: 1, visible: true });
        });
      })
      .catch((err) => {
        console.log(err);
        if (err?.message === "Network Error") {
          trySubmit(userInfo)
            .then((result) => {
              getNewUserInfo().then((result) => {
                navigation.navigate("Profile");
                setResultStatus({ isSuccess: 1, visible: true });
              });
            })
            .catch((err) => {
              console.log("err");
              setResultStatus({ isSuccess: 0, visible: true });
            });
          console.log(err);
        } else {
          setResultStatus({ isSuccess: 0, visible: true });
        }
      })
      .finally((result) => {
        setIsLoading(false);
      });
  };

  const getNewUserInfo = () => {
    return new Promise((resolve, reject) => {
      _retrieveData("ACCESS_TOKEN").then((access_token) => {
        const config = {
          headers: { Authorization: `Bearer ${access_token}` },
        };

        axios
          .get(`http://10.0.2.2:5000/users/user-info`, config)
          .then((result) => {
            resolve(result.data);
            setUser(result.data);
          })
          .catch((error) => {
            reject(err);
            console.log(error);
          });
      });
    });
  };

  return (
    <ImageBackground source={require("../../assets/images/page_bg1.jpg")} style={styles.wrapper}>
      <Formik
        initialValues={{
          phone_num: phone_num || "",
          birth_date: new Date(birth_date).toISOString().split("T")[0],
          address: address || "",
          gender: { value: gender, index: gender === 0 ? 1 : 0 },
          first_name: first_name || "",
          last_name: last_name || "",
          email_address: email_address || "",
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
                errorText={props.touched.phone_num ? props.errors.phone_num : undefined}
              />

              <InputItem
                _styles={[styles.input]}
                placeholder="Địa chỉ email"
                lableTitle="Địa chỉ email"
                value={props.values.email_address}
                read_only
              />

              <MyDateTimePicker
                _styles={[styles.input]}
                lableTitle="Ngày sinh"
                value={props.values.birth_date}
                errorText={props.touched.birth_date ? props.errors.birth_date : undefined}
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
                placeholder="Địa chỉ"
                lableTitle="Địa chỉ"
                onChange={props.handleChange("address")}
                value={props.values.address}
                errorText={props.touched.address ? props.errors.address : undefined}
              />

              <MenuPickers
                _styles={[styles.input]}
                lableTitle="Giới tính"
                initIndex={gender === 0 ? 1 : 0}
                value={props.values.gender}
                errorText={props.touched.gender ? props.errors.gender : undefined}
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
                errorText={props.touched.first_name ? props.errors.first_name : undefined}
              />
              <InputItem
                _styles={[styles.input]}
                placeholder="Tên và tên đệm"
                lableTitle="Tên và tên đệm"
                onChange={props.handleChange("last_name")}
                value={props.values.last_name}
                errorText={props.touched.last_name ? props.errors.last_name : undefined}
              />
            </ScrollView>
            <FlatButton
              _styles={styles.submitBtn}
              onPress={props.handleSubmit}
              text="Sửa profile"
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
        text={resultStatus?.message}
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
    width: "80%",
    height: normalize(32),
    borderRadius: normalize(40),
    marginBottom: normalize(12),
    paddingVertical: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c60ff",
    marginTop: normalize(10),
  },
});

export default EditProfileScreen;
