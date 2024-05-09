import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, ScrollView, Keyboard, TouchableOpacity, ImageBackground, Text } from "react-native";
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
import { useUserInfoContext } from "../../context/userInfoContext.js";
import ErrorAlertModal from "../../components/ErrorAlertModal.js";
import WarningAlertModal from "../../components/WarningAlertModal.js";
import CountDown from "../../components/CountDown.js";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";

const formSchema = yup.object({});

function EnterEmailCodeScreen({ route, navigation }) {
  const { duration, email_address } = route.params;

  const { user, setUser } = useUserInfoContext();

  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });

  const [value, setValue] = useState("");

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const CELL_COUNT = 6;

  useEffect(() => {
    if (value.length == 6) {
      handleSubmit(value);
    }
  }, [value]);

  const handleSubmit = (token) => {
    _retrieveData("ACCESS_TOKEN")
      .then((access_token) => {
        const configurations = {
          method: "POST",
          url: `http://10.0.2.2:5000/users/email`,
          data: { user_id: user.user_id, email_address, token },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        };

        axios(configurations)
          .then((result) => {
            setResultStatus({ isSuccess: 1, visible: true, message: "Success" });
            setUser((prev) => {
              return { ...prev, email_address: email_address };
            });
            navigation.navigate("Profile");
          })
          .catch((err) => {
            if (err?.response?.data?.message == "INVALID_VALIDATION_CODE") {
              setResultStatus({ isSuccess: 0, visible: true, message: "Invalid Code" });
            } else {
              setResultStatus({ isSuccess: 0, visible: true, message: "Failed" });
            }
            console.log("err", err);
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
    <ImageBackground source={require("../../assets/images/page_bg1.jpg")}>
      <TouchableOpacity style={styles.wrapper} activeOpacity={1.0} onPress={Keyboard.dismiss}>
        <View style={styles.formWrapper}>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            testID="my-code-input"
            renderCell={({ index, symbol, isFocused }) => (
              <View key={index} style={styles.cellContainer}>
                <Text style={[styles.cell, isFocused && styles.focusCell]} onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />
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
          <FlatButton _styles={styles.submitBtn} onPress={props.handleSubmit} text="Submit" fontSize={normalize(10)} />
        </View>
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
    marginBottom: normalize(10),
    width: "100%",
  },

  codeFieldRoot: { marginTop: 20, flexDirection: "row", justifyContent: "center", alignItems: "center" },

  cellContainer: {
    width: normalize(34),
    height: normalize(40),
    borderWidth: 1,
    borderColor: "#ced0d4",
    borderRadius: normalize(10),
    marginHorizontal: normalize(4),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  cell: {
    fontSize: normalize(16),
    textAlign: "center",
    fontFamily: "nunito-medium",
    color: "#505050",
    lineHeight: normalize(40),
  },

  focusCell: {
    borderColor: "#5b4cfd",
    lineHeight: normalize(34),
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

export default EnterEmailCodeScreen;
