import { ImageBackground, Keyboard, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import InputItem from "../../components/InputItem";
import { Formik } from "formik";
import * as yup from "yup";
import { SCREEN_WIDTH, _retrieveData, _storeData, normalize } from "../../defined_function";
import FlatButton from "../../shared/FlatButton";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { useAuthContext } from "../../context/roleContext";
import axios from "axios";
import AlertModal from "../../components/AlertModal";
import { useState } from "react";
import LoadingModal from "../../components/LoadingModal";

const loginSchema = yup.object({
  user_name: yup.string().required("User name is required"),
  password: yup.string().required("Password is required"),
});

function LoginScreen({ navigation, handleSubmit }) {
  const { auth, setAuth } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });

  const handleLogin = (values) => {
    setIsLoading(true);

    _retrieveData("ACCESS_TOKEN")
      .then((access_token) => {
        const { user_name, password } = values;

        const payload = {
          user_name: user_name?.trim(),
          password: password?.trim(),
        };

        const config = {
          headers: { Authorization: `Bearer ${access_token}` },
        };

        axios
          .post(`http://10.0.2.2:5000/auth/login`, payload, config)
          .then((result) => {
            const { user_info, access_token } = result.data;
            const { user_name, user_id } = user_info;
            const storeAT = new Promise((resolve, reject) => {
              _storeData("ACCESS_TOKEN", access_token)
                .then(resolve({ user_info, access_token }))
                .catch((err) => {
                  reject(err);
                });
            });

            const storeUI = new Promise((resolve, reject) => {
              _storeData("USER_INFO", JSON.stringify(user_info))
                .then(resolve({ user_info, access_token }))
                .catch((err) => {
                  reject(err);
                });
            });

            if (result.data?.code == "USER_INFO_NULL") {
              storeAT
                .then((result) => {
                  setResultStatus({ isSuccess: 1, visible: true });
                  navigation.navigate("AvatarPicker", { user_name, user_id });
                })
                .catch((err) => {
                  setResultStatus({ isSuccess: 0, visible: true });
                });
              return { code: "USER_INFO_NULL" };
            } else {
              return Promise.all([storeAT, storeUI]).then(([resolve1, resolve2]) => {
                return { user_info, access_token };
              });
            }
          })
          .then((result) => {
            if (result?.code == "USER_INFO_NULL") {
              return;
            } else {
              const { user_info, access_token } = result;
              if (user_info?.role) {
                setResultStatus({ isSuccess: 1, visible: true });
                setAuth(user_info?.role);
              }
            }
          })
          .catch((err) => {
            console.log("err", err);
            setResultStatus({ isSuccess: 0, visible: true, message: "User name or Password was wrong" });
          })
          .finally((result) => {
            setIsLoading(false);
          });
      })
      .catch((err) => {
        setResultStatus({ isSuccess: 0, visible: true });
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <ImageBackground source={require("../../assets/images/page_bg1.jpg")} style={styles.wrapper}>
      <FlatButton _styles={styles.backBtn} onPress={() => navigation.navigate("Welcome")}>
        <FontAwesome6 name="chevron-left" size={normalize(14)} color="#3c3c3c" />
      </FlatButton>
      <View style={styles.content}>
        <Text style={styles.title}>Lets Sign you in</Text>
        <Text style={styles.subTitle}>Welcome Back, You have been missed</Text>
      </View>
      <View style={styles.formContainer}>
        <Formik
          initialValues={{ user_name: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={(values, actions) => {
            handleLogin(values);
          }}
        >
          {(props) => (
            <TouchableOpacity style={styles.formWrapper} activeOpacity={1} onPress={Keyboard.dismiss}>
              <InputItem
                _styles={[styles.input]}
                lableTitle="User name"
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
                secureTextEntry={true}
                onChange={props.handleChange("password")}
                value={props.values.password}
                errorText={props.touched.password ? props.errors.password : undefined}
              />

              <View style={styles.forgotContainer}>
                <TouchableOpacity
                  style={styles.forgotBtn}
                  onPress={() => navigation.navigate("EnterEmailToResetPassword")}
                >
                  <Text style={styles.forgotText}>Forgot Password ?</Text>
                </TouchableOpacity>
              </View>

              <FlatButton
                _styles={styles.submitBtn}
                onPress={props.handleSubmit}
                text="Sign up"
                fontSize={normalize(12)}
              />
            </TouchableOpacity>
          )}
        </Formik>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Don't have an account? </Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.loginText}>Register Now</Text>
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
    marginBottom: normalize(10),
    borderWidth: 1,
    borderColor: "#ced0d4",
    borderRadius: normalize(10),
    padding: normalize(5),
  },
  forgotContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  forgotBtn: {
    minWidth: normalize(100),
  },
  forgotText: { fontFamily: "nunito-bold", fontSize: normalize(12), color: "#505050", marginRight: normalize(10) },
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

export default LoginScreen;
