import React from "react";
import { StyleSheet, Button, TextInput, View, Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/global.js";
import { normalize } from "../defined_function/index.js";

function MyDateTimePicker({ _styles, lableTitle, value, errorText, onPress, border }) {
  return (
    <View style={[_styles, styles.wrapper, { borderWidth: border ? 1 : 0 }]}>
      <Text style={[styles.lableTitle, { backgroundColor: border ? "#fff" : "transparent" }]}>{lableTitle}</Text>
      <TouchableOpacity activeOpacity={1.0} onPress={onPress}>
        <Text style={[globalStyles.input, styles.input, { marginTop: border ? normalize(4) : normalize(4) }]}>
          {value}
        </Text>
      </TouchableOpacity>
      {errorText && <Text style={[styles.errorText]}>{errorText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    borderWidth: 1,
    borderColor: "#d8dde7",
    padding: normalize(6),
    borderRadius: normalize(6),
  },
  lableTitle: {
    position: "absolute",
    zIndex: 10,
    left: normalize(6),
    top: normalize(-6),
    fontSize: normalize(11),
    letterSpacing: 1,
    color: "#3c3c3c",
    backgroundColor: "#fff",
    paddingHorizontal: normalize(6),
    fontFamily: "nunito-bold",
  },
  input: {
    marginTop: normalize(4),
    fontSize: normalize(12),
    fontFamily: "nunito-regular",
    borderColor: "transparent",
    letterSpacing: 1,
    color: "#676768",
    marginLeft: normalize(6),
  },
  errorText: {
    marginBottom: normalize(4),
    fontSize: normalize(9),
    marginLeft: normalize(6),
    color: "#f02849",
  },
});

export default MyDateTimePicker;
