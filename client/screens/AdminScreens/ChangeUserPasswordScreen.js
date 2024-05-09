import React, { useRef, useState } from "react";
import { StyleSheet, View, ScrollView, Keyboard, TouchableOpacity, ImageBackground } from "react-native";
import { Formik } from "formik";
import FlatButton from "../../shared/FlatButton.js";
import * as yup from "yup";
import InputItem from "../../components/InputItem.js";
import axios from "axios";
import AvatarPicker from "../../components/AvatarPicker.js";
import DateTimePicker from "@react-native-community/datetimepicker";
import MyDateTimePicker from "../../components/MyDateTimePicker.js";
import MenuPickers from "../../components/MenuPicker.js";
import LoadingModal from "../../components/LoadingModal.js";
import AlertModal from "../../components/AlertModal.js";
import { _retrieveData, normalize } from "../../defined_function/index.js";

const formSchema = yup.object({
  new_password: yup
    .string()
    .test("", "Password should contains atleast 8 charaters and containing uppercase,lowercase and numbers", (val) => {
      return new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).test(val);
    }),

  retype_password: yup.string().test("", "passwords do not match", (val, form) => {
    return val == form.parent.new_password;
  }),
});

function ChangeUserPasswordScreen({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });

  const handleSubmit = (values) => {
    const { old_password, new_password } = values;

    _retrieveData("ACCESS_TOKEN")
      .then((access_token) => {
        const configurations = {
          method: "PUT",
          url: `http://10.0.2.2:5000/users/password`,
          data: { old_password, new_password },
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
            if (err?.response?.data?.message == "WRONG_PASSWORD") {
              setResultStatus({ isSuccess: 0, visible: true, message: "Current password is incorrect" });
            } else {
              setResultStatus({ isSuccess: 0, visible: true });
            }
            console.log("err", err);
          })
          .finally((result) => {
            setIsLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ImageBackground source={require("../../assets/images/page_bg1.jpg")}>
      <TouchableOpacity style={styles.wrapper} activeOpacity={1.0} onPress={Keyboard.dismiss}>
        <Formik
          initialValues={{
            old_password: "",
            new_password: "",
            retype_password: "",
          }}
          validationSchema={formSchema}
          onSubmit={(values, actions) => {
            handleSubmit(values);
          }}
        >
          {(props) => (
            <View style={styles.formWrapper}>
              <InputItem
                _styles={[styles.input]}
                placeholder="Mật khẩu cũ"
                lableTitle="Mật khẩu cũ"
                onChange={props.handleChange("old_password")}
                value={props.values.old_password}
                secureTextEntry={true}
                errorText={props.touched.old_password ? props.errors.old_password : undefined}
                border
              />

              <InputItem
                _styles={[styles.input]}
                placeholder="Mật khẩu mới"
                lableTitle="Mật khẩu mới"
                onChange={props.handleChange("new_password")}
                secureTextEntry={true}
                value={props.values.new_password}
                errorText={props.touched.new_password ? props.errors.new_password : undefined}
                border
              />

              <InputItem
                _styles={[styles.input]}
                placeholder="Nhập lại mật khẩu mới"
                lableTitle="Nhập lại mật khẩu mới"
                onChange={props.handleChange("retype_password")}
                secureTextEntry={true}
                value={props.values.retype_password}
                errorText={props.touched.retype_password ? props.errors.retype_password : undefined}
                border
              />
              <FlatButton
                _styles={styles.submitBtn}
                onPress={props.handleSubmit}
                text="Đổi mật khẩu"
                fontSize={normalize(10)}
              />
            </View>
          )}
        </Formik>
        <LoadingModal visible={isLoading} />
        <AlertModal
          onClose={() => setResultStatus({ isSuccess: 0, visible: false })}
          isSuccess={resultStatus?.isSuccess}
          visible={resultStatus?.visible ? true : false}
          text={resultStatus?.message}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: "100%",
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },

  container: {
    height: "100%",
    width: "100%",
  },

  formWrapper: {
    width: "90%",
    margin: normalize(20),
    justifyContent: "space-between",
    alignItems: "center",
  },

  input: {
    marginBottom: normalize(20),
    width: "100%",
  },

  submitBtn: {
    width: "100%",
    height: normalize(32),
    marginTop: normalize(10),
    marginBottom: normalize(20),
    paddingVertical: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c60ff",
    borderRadius: normalize(100),
  },
});

export default ChangeUserPasswordScreen;
