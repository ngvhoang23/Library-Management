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
  birth_date: yup
    .string()
    .required()
    .test("older than 17", "Age must be equal or greater than 18", (val) => {
      const year = val.split("-")[0];
      const currentYear = new Date().getFullYear();
      age = currentYear - year;
      return age >= 18;
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

function EditEmployeeScreen({ route, navigation }) {
  const { emp_info } = route.params;
  const {
    user_id,
    user_avatar,
    phone_num,
    birth_date,
    email_address,
    gender,
    first_name,
    last_name,
    created_at,
    address,
  } = emp_info;
  const [avatar, setAvatar] = useState();
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [isShowWorkDatePicker, setIsShowWorkDatePicker] = useState(false);
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

  const trySubmit = (empInfo) => {
    const { phone_num, birth_date, email_address, gender, first_name, last_name, first_work_date, address } = empInfo;
    setIsLoading(true);
    const formData = new FormData();

    if (!user_id) {
      return;
    }

    avatar &&
      formData.append("avatar", {
        uri: avatar.uri,
        name: "emp-avatar",
        type: avatar.mimeType,
      });
    user_id && formData.append("user_id", user_id);
    phone_num && formData.append("phone_num", phone_num.trim());
    address && formData.append("address", address.trim());
    birth_date && formData.append("birth_date", birth_date);
    formData.append("email_address", email_address.trim());
    formData.append("gender", gender.value);
    first_name && formData.append("first_name", first_name.trim());
    last_name && formData.append("last_name", last_name.trim());
    first_work_date && formData.append("created_at", first_work_date);

    return new Promise((resolve, reject) => {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const configurations = {
            method: "PUT",
            url: `http://10.0.2.2:5000/users/employee`,
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

  const handleSubmit = (empInfo) => {
    trySubmit(empInfo)
      .then((result) => {
        navigation.navigate("Employee Detail", { emp_info: { user_id: user_id } });
        setResultStatus({ isSuccess: 1, visible: true });
      })
      .catch((err) => {
        if (err?.message === "Network Error") {
          trySubmit(empInfo)
            .then((result) => {
              navigation.navigate("Employee Detail", { emp_info: { user_id: user_id } });
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
    <View style={styles.wrapper}>
      <Formik
        initialValues={{
          phone_num: phone_num || "",
          email_address: email_address || "",
          birth_date: new Date(birth_date).toISOString().split("T")[0],
          gender: { value: gender, index: gender === 0 ? 1 : 0 },
          first_name: first_name || "",
          last_name: last_name || "",
          address: address || "",
          first_work_date: new Date(created_at).toISOString().split("T")[0],
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
                  value={new Date(birth_date)}
                  onChange={(event, selectedDate) => {
                    setIsShowDatePicker(false);
                    props.setFieldValue("birth_date", selectedDate.toISOString().split("T")[0]);
                  }}
                />
              )}

              <MyDateTimePicker
                _styles={[styles.input]}
                lableTitle="First Working Day"
                value={props.values.first_work_date}
                errorText={props.errors.first_work_date}
                onPress={() => setIsShowWorkDatePicker(true)}
              />
              {isShowWorkDatePicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={new Date(created_at)}
                  onChange={(event, selectedDate) => {
                    setIsShowWorkDatePicker(false);
                    props.setFieldValue("first_work_date", selectedDate.toISOString().split("T")[0]);
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
                text="submit"
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
    </View>
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
    marginBottom: normalize(12),
    paddingVertical: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e74fd",
  },
});

export default EditEmployeeScreen;