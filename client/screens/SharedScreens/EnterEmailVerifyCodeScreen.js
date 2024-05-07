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
import { useEffect, useRef, useState } from "react";
import LoadingModal from "../../components/LoadingModal";

import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";
import CountDown from "../../components/CountDown";
import { useIsFocused } from "@react-navigation/native";

function EnterEmailVerifyCodeScreen({ route, navigation }) {
  const { handleSubmit, email_address } = route.params;

  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });
  const [duration, setDuration] = useState(null);
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

  useEffect(() => {
    if (isFocused) {
      const configurations = {
        method: "GET",
        url: `http://10.0.2.2:5000/email/validation-token`,
        params: { email_address: email_address },
        headers: {
          Accept: "application/json",
        },
      };

      axios(configurations)
        .then((result) => {
          setDuration(result?.data?.duration);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }, [isFocused]);

  useEffect(() => {
    if (duration) {
      setIsLoading(false);
    }
  }, [duration]);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  return (
    <ImageBackground source={require("../../assets/images/page_bg1.jpg")} style={styles.wrapper}>
      <FlatButton _styles={styles.backBtn} onPress={() => navigation.goBack()}>
        <FontAwesome6 name="chevron-left" size={normalize(14)} color="#3c3c3c" />
      </FlatButton>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Lets Verify Your Email</Text>
          <Text style={styles.subTitle}>
            We emailed you a six-digit code to {email_address}. Enter the code below to confirm you email address
          </Text>
        </View>
        {duration && (
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
        )}
        <View style={styles.footer}>
          {duration && (
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
          )}
        </View>
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

  container: {
    flex: 1,
    paddingTop: normalize(100),
    width: "100%",
  },

  content: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    marginBottom: normalize(14),
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
    fontSize: normalize(11),
    color: "#505050",
    marginBottom: normalize(10),
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: normalize(30),
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
});

export default EnterEmailVerifyCodeScreen;
