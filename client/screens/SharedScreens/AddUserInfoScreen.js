import { Image, ImageBackground, Keyboard, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import FlatButton from "../../shared/FlatButton";
import { AntDesign, FontAwesome6, Feather } from "@expo/vector-icons";
import { _retrieveData, _storeData, normalize } from "../../defined_function";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Formik } from "formik";
import * as yup from "yup";
import InputItem from "../../components/InputItem";
import { useState } from "react";
import MenuPickers from "../../components/MenuPicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import MyDateTimePicker from "../../components/MyDateTimePicker.js";
import axios from "axios";
import LoadingModal from "../../components/LoadingModal.js";
import AlertModal from "../../components/AlertModal.js";
import { useAuthContext } from "../../context/roleContext.js";

const formSchema = yup.object({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  birth_date: yup
    .string()
    .required()
    .test("older than 17", "Age must be from 18 to 55", (val) => {
      const year = val.split("-")[0];
      const currentYear = new Date().getFullYear();
      age = currentYear - year;
      return age >= 18 && age <= 55;
    }),
});

function AddUserInfoScreen({ route, navigation }) {
  const { avatar, user_id, user_name } = route.params;

  const { auth, setAuth } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });

  const [isShowDatePicker, setIsShowDatePicker] = useState(false);

  const handleSubmit = (values) => {
    setIsLoading(true);
    const { birth_date, gender, first_name, last_name } = values;

    const created_at = new Date();

    const expired_date = new Date(created_at.setMonth(created_at.getMonth() + 6));

    const formData = new FormData();

    avatar &&
      formData.append("avatar", {
        uri: avatar.uri,
        name: "reader-avatar",
        type: avatar.mimeType,
      });

    user_id && formData.append("user_id", user_id);
    birth_date && formData.append("birth_date", birth_date);
    user_name && formData.append("email_address", user_name.trim());
    formData.append("gender", gender?.value);
    first_name && formData.append("first_name", first_name.trim());
    last_name && formData.append("last_name", last_name.trim());
    created_at && formData.append("created_at", new Date().toISOString().split("T")[0]);
    expired_date && formData.append("expired_date", expired_date.toISOString().split("T")[0]);

    _retrieveData("ACCESS_TOKEN")
      .then((access_token) => {
        const configurations = {
          method: "POST",
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
            const user_info = result.data;
            return new Promise((resolve, reject) => {
              _storeData("USER_INFO", JSON.stringify(user_info))
                .then(resolve({ user_info, access_token }))
                .catch((err) => {
                  reject(err);
                });
            });
          })
          .then(({ user_info, access_token }) => {
            setIsLoading(false);
            if (user_info?.role) {
              setResultStatus({ isSuccess: 1, visible: true });
              setAuth(user_info?.role);
            }
          })
          .catch((err) => {
            console.log("err", err);
            setResultStatus({ isSuccess: 0, visible: true });
            setIsLoading(false);
          })
          .finally((result) => {
            setIsLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally((result) => {
        setIsLoading(false);
      });
  };

  return (
    <ImageBackground source={require("../../assets/images/page_bg1.jpg")} style={{ flex: 1 }}>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.header}>
          <FlatButton _styles={styles.backBtn} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={normalize(20)} color="#3c3c3c" />
          </FlatButton>
          <Text style={styles.headerTitle}>Enter your information</Text>
        </View>

        <View style={styles.formContainer}>
          <Formik
            initialValues={{
              birth_date: new Date().toISOString().split("T")[0],
              gender: { value: 1, index: 0 },
              first_name: "",
              last_name: "",
            }}
            validationSchema={formSchema}
            onSubmit={(values, actions) => {
              handleSubmit(values);
            }}
          >
            {(props) => (
              <TouchableOpacity style={styles.formWrapper} activeOpacity={1} onPress={Keyboard.dismiss}>
                <InputItem
                  _styles={[styles.input]}
                  placeholder="First name"
                  lableTitle="First Name"
                  border
                  placeholderTextColor="#8c8c8d"
                  onChange={props.handleChange("first_name")}
                  value={props.values.first_name}
                  errorText={props.touched.first_name ? props.errors.first_name : undefined}
                />

                <InputItem
                  _styles={[styles.input]}
                  placeholder="Last name"
                  lableTitle="Last Name"
                  border
                  placeholderTextColor="#8c8c8d"
                  onChange={props.handleChange("last_name")}
                  value={props.values.last_name}
                  errorText={props.touched.last_name ? props.errors.last_name : undefined}
                />

                <MyDateTimePicker
                  _styles={[styles.input]}
                  lableTitle="Birth Date"
                  border
                  value={props.values.birth_date}
                  errorText={props.touched.birth_date ? props.errors.birth_date : undefined}
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

                <MenuPickers
                  _styles={[styles.input]}
                  lableTitle="Gender"
                  border
                  initIndex={0}
                  value={props.values.gender}
                  errorText={props.touched.gender ? props.errors.gender : undefined}
                  options={[
                    { title: "Male", value: 1 },
                    { title: "Female", value: 0 },
                  ]}
                  onChange={(selectedValue, selectedIndex) =>
                    props.setFieldValue("gender", { value: selectedValue, index: selectedIndex })
                  }
                />

                <View style={styles.footer}>
                  <View style={styles.progressContainer}>
                    <View style={[styles.dot]}></View>
                    <View style={[styles.dot, { backgroundColor: "#6c60ff" }]}></View>
                  </View>

                  <View style={styles.btnContainer}>
                    <FlatButton
                      _styles={styles.submitBtn}
                      text="Finish"
                      fontSize={normalize(12)}
                      onPress={props.handleSubmit}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </Formik>
        </View>
      </SafeAreaView>
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
    justifyContent: "space-evenly",
    flex: 1,
    position: "relative",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: normalize(30),
    left: normalize(20),
  },

  backBtn: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: normalize(26),
  },

  headerTitle: {
    fontFamily: "nunito-bold",
    color: "#505050",
    fontSize: normalize(16),
    textAlign: "center",
    borderRadius: normalize(10),
  },

  formContainer: {
    marginTop: normalize(20),
    width: "100%",
  },

  formWrapper: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    width: "100%",
    marginBottom: normalize(20),
  },

  footer: {
    width: "100%",
    marginTop: normalize(30),
  },

  btnContainer: {
    width: "100%",
  },

  submitBtn: {
    width: "100%",
    backgroundColor: "#6c60ff",
    paddingVertical: normalize(8),
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: normalize(20),
  },
  dot: {
    width: normalize(10),
    height: normalize(10),
    borderWidth: 1,
    borderColor: "#ced0d4",
    borderRadius: normalize(1000),
    marginHorizontal: normalize(6),
    elevation: 0.4,
    shadowColor: "#52006A",
  },
});

export default AddUserInfoScreen;
