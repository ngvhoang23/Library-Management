import { ImageBackground, Keyboard, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import InputItem from "../../components/InputItem";
import { Formik } from "formik";
import * as yup from "yup";
import { SCREEN_WIDTH, _storeData, normalize, validateEmail } from "../../defined_function";
import FlatButton from "../../shared/FlatButton";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import LoadingModal from "../../components/LoadingModal";
import AlertModal from "../../components/AlertModal";
import { useState } from "react";
import axios from "axios";

const formSchema = yup.object({
  user_name: yup.string().test("email pattern", "User Name must be an email", (val) => {
    return validateEmail(val);
  }),
});

function EnterEmailToResetPasswordScreen({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });

  const checkEmail = (values) => {
    const { user_name } = values;

    setIsLoading(true);

    const config = {
      params: {
        user_name,
      },
    };

    axios
      .get(`http://10.0.2.2:5000/users/check-email-user`, config)
      .then((result) => {
        const { email_address } = result.data;
        setResultStatus({ isSuccess: 1, visible: true });
        navigation.navigate("EnterEmailVerifyCode", {
          email_address: email_address,
          handleSubmit: (token) => handleOpenResetPasswordScreen(user_name, token),
        });
      })
      .catch((error) => {
        if (error?.response?.data?.code == "USER_NONEXISTENT") {
          setResultStatus({ isSuccess: 0, visible: true, message: "User Name does not exist :(" });
        } else {
          setResultStatus({ isSuccess: 0, visible: true });
        }
        console.log(error);
      })
      .finally((result) => {
        setIsLoading(false);
      });
  };

  const handleOpenResetPasswordScreen = (user_name, token) => {
    setIsLoading(true);

    const config = {
      params: {
        token,
      },
    };

    axios
      .get(`http://10.0.2.2:5000/email/get-ressetpw-token`, config)
      .then((result) => {
        const { token, duration } = result.data;
        setResultStatus({ isSuccess: 1, visible: true });
        navigation.navigate("ResetPassword", { user_name, token, duration });
      })
      .catch((error) => {
        if (error?.response?.data?.message == "INVALID_CODE") {
          setResultStatus({ isSuccess: 0, visible: true, message: "invalid code :(" });
        } else {
          setResultStatus({ isSuccess: 0, visible: true });
        }
        console.log(error);
      })
      .finally((result) => {
        setIsLoading(false);
      });
  };

  return (
    <ImageBackground source={require("../../assets/images/page_bg1.jpg")} style={styles.wrapper}>
      <FlatButton _styles={styles.backBtn} onPress={() => navigation.goBack()}>
        <FontAwesome6 name="chevron-left" size={normalize(14)} color="#3c3c3c" />
      </FlatButton>
      <View style={styles.content}>
        <Text style={styles.title}>Enter User Name</Text>
        <Text style={styles.subTitle}>We will send a code to your email to retrieve your password</Text>
      </View>
      <View style={styles.formContainer}>
        <Formik
          initialValues={{
            user_name: "",
          }}
          validationSchema={formSchema}
          onSubmit={(values, actions) => {
            checkEmail(values);
          }}
        >
          {(props) => {
            return (
              <TouchableOpacity style={styles.formWrapper} activeOpacity={1} onPress={Keyboard.dismiss}>
                <InputItem
                  _styles={[styles.input]}
                  placeholder="User Name"
                  border
                  placeholderTextColor="#8c8c8d"
                  onChange={props.handleChange("user_name")}
                  value={props.values.user_name}
                  errorText={props.touched.user_name ? props.errors.user_name : undefined}
                />

                <FlatButton
                  _styles={styles.submitBtn}
                  onPress={props.handleSubmit}
                  text="Send Code"
                  fontSize={normalize(12)}
                />
              </TouchableOpacity>
            );
          }}
        </Formik>
      </View>
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
    paddingHorizontal: normalize(30),
    paddingTop: StatusBar.currentHeight + normalize(0),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flex: 1,
  },
  backBtn: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(1000),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ced0d4",
    position: "absolute",
    top: normalize(30),
    left: normalize(20),
  },
  content: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    width: SCREEN_WIDTH / 1.5,
    fontFamily: "nunito-bold",
    fontSize: normalize(24),
    color: "#292929",
    marginBottom: normalize(10),
  },
  subTitle: {
    width: SCREEN_WIDTH / 1.5,
    fontFamily: "nunito-medium",
    fontSize: normalize(12),
    color: "#505050",
    marginBottom: normalize(10),
  },
  formContainer: {
    marginTop: normalize(20),
    width: "100%",
  },
  formWrapper: {},
  input: {
    marginBottom: normalize(16),
  },
  submitBtn: {
    width: "100%",
    height: normalize(32),
    marginTop: normalize(20),
    paddingVertical: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c60ff",
    borderRadius: normalize(10),
  },
});

export default EnterEmailToResetPasswordScreen;
