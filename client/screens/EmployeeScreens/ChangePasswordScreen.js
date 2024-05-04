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
  password: yup
    .string()
    .trim()
    .required()
    .test("", "Password should contains atleast 8 charaters and containing uppercase,lowercase and numbers", (val) => {
      return new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).test(val);
    }),
});

function ChangePasswordScreen({ route, navigation }) {
  const { user_id } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });

  const handleSubmit = (values) => {
    const { password } = values;

    _retrieveData("ACCESS_TOKEN")
      .then((access_token) => {
        const configurations = {
          method: "PUT",
          url: `http://10.0.2.2:5000/users/password-by-admin`,
          data: { password, user_id },
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
            password: "",
          }}
          validationSchema={formSchema}
          onSubmit={(values, actions) => {
            actions.resetForm();
            handleSubmit(values);
          }}
        >
          {(props) => (
            <View style={styles.formWrapper}>
              <InputItem
                _styles={[styles.input]}
                placeholder="Mật khẩu mới"
                lableTitle="Mật khẩu mới"
                onChange={props.handleChange("password")}
                value={props.values.password}
                errorText={props.errors.password}
                secureTextEntry={true}
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

export default ChangePasswordScreen;
