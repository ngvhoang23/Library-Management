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
  password: yup
    .string()
    .trim()
    .required()
    .test("", "Password should contains atleast 8 charaters and containing uppercase,lowercase and numbers", (val) => {
      return new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).test(val);
    }),
  retype_password: yup.string().test("", "Please make sure your passwords match", (val, form) => {
    return val == form.parent.password;
  }),
});

function RegisterScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });

  const handleSubmit = (values, token) => {
    const { user_name, password } = values;

    setIsLoading(true);

    const configurations = {
      method: "POST",
      url: `http://10.0.2.2:5000/users/register-account`,
      data: { user_name, password, token },
      headers: {
        Accept: "application/json",
      },
    };

    axios(configurations)
      .then((result) => {
        const { user_info, access_token } = result.data;
        return new Promise((resolve, reject) => {
          _storeData("ACCESS_TOKEN", access_token)
            .then((result) => {
              resolve(user_info);
            })
            .catch((err) => {
              reject(err);
            });
        });
      })
      .then((user_info) => {
        const { user_name, user_id } = user_info;
        navigation.navigate("AvatarPicker", { user_name, user_id });
        setResultStatus({ isSuccess: 1, visible: true });
      })
      .catch((err) => {
        if (err?.response?.data?.code == "INVALID_VALIDATION_CODE") {
          setResultStatus({ isSuccess: 0, visible: true, message: "Wrong code :(" });
        }
        if (err?.response?.data?.code == "USER_NAME_EXISTED") {
          setResultStatus({ isSuccess: 0, visible: true, message: "User Name already exists :(" });
        }
        console.log("err", err);
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
        <Text style={styles.title}>Lets Register Account</Text>
        <Text style={styles.subTitle}>Hello user, you have a greatful journey</Text>
      </View>
      <View style={styles.formContainer}>
        <Formik
          initialValues={{
            user_name: "",
            password: "",
            retype_password: "",
          }}
          validationSchema={formSchema}
          onSubmit={(values, actions) => {
            navigation.navigate("EnterEmailVerifyCode", {
              email_address: values.user_name,
              handleSubmit: (token) => handleSubmit(values, token),
            });
          }}
        >
          {(props) => {
            return (
              <TouchableOpacity style={styles.formWrapper} activeOpacity={1} onPress={Keyboard.dismiss}>
                <InputItem
                  _styles={[styles.input]}
                  lableTitle="User Name"
                  border
                  placeholderTextColor="#8c8c8d"
                  onChange={props.handleChange("user_name")}
                  value={props.values.user_name}
                  errorText={props.touched.user_name ? props.errors.user_name : undefined}
                />

                <InputItem
                  _styles={[styles.input]}
                  lableTitle="Passoword"
                  border
                  placeholderTextColor="#8c8c8d"
                  onChange={props.handleChange("password")}
                  value={props.values.password}
                  secureTextEntry={true}
                  errorText={props.touched.password ? props.errors.password : undefined}
                />

                <InputItem
                  _styles={[styles.input]}
                  lableTitle="Retype Password"
                  border
                  placeholderTextColor="#8c8c8d"
                  onChange={props.handleChange("retype_password")}
                  value={props.values.retype_password}
                  secureTextEntry={true}
                  errorText={props.touched.retype_password ? props.errors.retype_password : undefined}
                />
                <FlatButton
                  _styles={styles.submitBtn}
                  onPress={props.handleSubmit}
                  text="Sign up"
                  fontSize={normalize(12)}
                />
              </TouchableOpacity>
            );
          }}
        </Formik>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Already have an account? </Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
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
    fontSize: normalize(15),
    color: "#292929",
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
  footer: {
    flexDirection: "row",
    marginTop: normalize(16),
  },

  footerTitle: {
    fontFamily: "nunito-medium",
    fontSize: normalize(12),
    color: "#505050",
  },
  loginBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontFamily: "nunito-bold",
    fontSize: normalize(13),
    color: "#6c60ff",
    marginLeft: normalize(4),
  },
});

export default RegisterScreen;
