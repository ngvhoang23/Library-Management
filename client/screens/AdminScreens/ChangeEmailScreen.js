import React, { useRef, useState } from "react";
import { StyleSheet, View, ScrollView, Keyboard, TouchableOpacity, ImageBackground } from "react-native";
import { Formik } from "formik";
import FlatButton from "../../shared/FlatButton.js";
import * as yup from "yup";
import InputItem from "../../components/InputItem.js";
import axios from "axios";
import LoadingModal from "../../components/LoadingModal.js";
import AlertModal from "../../components/AlertModal.js";
import { _retrieveData, normalize, validateEmail } from "../../defined_function/index.js";
import { useUserInfoContext } from "../../context/userInfoContext";
import CountDown from "../../components/CountDown.js";
import { duration } from "moment";

const formSchema = yup.object({
  email_address: yup.string().test("email pattern", "Enter a valid email address", (val) => {
    return validateEmail(val);
  }),
});

function ChangeEmailScreen({ route, navigation }) {
  const { user, setUser } = useUserInfoContext();

  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });

  const handleSubmit = (values) => {
    const { email_address } = values;

    setIsLoading(true);

    _retrieveData("ACCESS_TOKEN")
      .then((access_token) => {
        const configurations = {
          method: "GET",
          url: `http://10.0.2.2:5000/email/validation-token`,
          params: { email_address },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        };

        axios(configurations)
          .then((result) => {
            navigation.navigate("Enter Email Code", { duration: result?.data?.duration || 0, email_address });
          })
          .catch((err) => {
            console.log("err", err);
          })
          .finally((result) => {
            setIsLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    return;
  };

  return (
    <ImageBackground source={require("../../assets/images/page_bg1.jpg")}>
      <TouchableOpacity style={styles.wrapper} activeOpacity={1.0} onPress={Keyboard.dismiss}>
        <Formik
          initialValues={{
            email_address: "",
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
                placeholder="Nhập email"
                lableTitle="Nhập email"
                onChange={props.handleChange("email_address")}
                value={props.values.email_address}
                errorText={props.errors.email_address}
              />
              <FlatButton
                _styles={styles.submitBtn}
                onPress={props.handleSubmit}
                text="Lấy mã xác nhận"
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
    width: "90%",
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

export default ChangeEmailScreen;
