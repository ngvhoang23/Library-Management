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
import CountDown from "../../components/CountDown";

const formSchema = yup.object({
  new_password: yup
    .string()
    .trim()
    .required()
    .test("", "Password should contains atleast 8 charaters and containing uppercase,lowercase and numbers", (val) => {
      return new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).test(val);
    }),
  retype_password: yup.string().test("", "Please make sure your passwords match", (val, form) => {
    return val == form.parent.new_password;
  }),
});

function ResetPasswordScreen({ route, navigation }) {
  const { user_name, token, duration } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });

  const handleSubmit = (values) => {
    const { new_password } = values;

    setIsLoading(true);

    const configurations = {
      method: "POST",
      url: `http://10.0.2.2:5000/users/reset-password`,
      data: { user_name, new_password, token },
      headers: {
        Accept: "application/json",
      },
    };

    axios(configurations)
      .then((result) => {
        setResultStatus({ isSuccess: 1, visible: true });
        navigation.navigate("Login");
      })
      .catch((err) => {
        setResultStatus({ isSuccess: 1, visible: true });
        console.log(err);
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
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subTitle}>Enter a new Password for </Text>
        <Text style={styles.subTitle}>{user_name}</Text>
      </View>
      <View style={styles.formContainer}>
        <Formik
          initialValues={{
            new_password: "",
            retype_password: "",
          }}
          validationSchema={formSchema}
          onSubmit={(values, actions) => {
            handleSubmit(values);
          }}
        >
          {(props) => {
            return (
              <TouchableOpacity style={styles.formWrapper} activeOpacity={1} onPress={Keyboard.dismiss}>
                <InputItem
                  _styles={[styles.input]}
                  placeholder="New Password"
                  border
                  placeholderTextColor="#8c8c8d"
                  onChange={props.handleChange("new_password")}
                  value={props.values.new_password}
                  errorText={props.touched.new_password ? props.errors.new_password : undefined}
                  secureTextEntry={true}
                />

                <InputItem
                  _styles={[styles.input]}
                  placeholder="Re-type New Password"
                  border
                  placeholderTextColor="#8c8c8d"
                  onChange={props.handleChange("retype_password")}
                  value={props.values.retype_password}
                  errorText={props.touched.retype_password ? props.errors.retype_password : undefined}
                  secureTextEntry={true}
                />

                <FlatButton
                  _styles={styles.submitBtn}
                  onPress={props.handleSubmit}
                  text="Reset Password"
                  fontSize={normalize(12)}
                />
              </TouchableOpacity>
            );
          }}
        </Formik>
        <CountDown
          _styles={styles.countDown}
          title={"Code will expired in "}
          initValue={duration / 1000}
          onTimeOut={() => {
            setResultStatus({ isSuccess: 0, visible: true, message: "Code expired" });
            setTimeout(() => {
              navigation.goBack();
            }, 1000);
          }}
        />
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

export default ResetPasswordScreen;
