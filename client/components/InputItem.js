import React from "react";
import { StyleSheet, Button, TextInput, View, Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/global.js";
import { normalize } from "../defined_function/index.js";

function InputItem({
  _styles,
  lableTitle,
  placeholder,
  onChange,
  value,
  errorText,
  onPress,
  read_only,
  textStyles,
  multiline,
  numberOnly,
  placeholderTextColor,
  secureTextEntry,
  border,
  icon,
}) {
  return (
    <View style={[styles.wrapper, { borderWidth: border ? 1 : 0 }, _styles]}>
      {lableTitle && (
        <Text style={[styles.lableTitle, { backgroundColor: border ? "#fff" : "transparent" }]}>{lableTitle}</Text>
      )}
      <TouchableOpacity activeOpacity={1.0} onPress={onPress} style={styles.inputBox}>
        <TextInput
          style={[globalStyles.input, styles.input, textStyles, { marginTop: border ? normalize(4) : normalize(6) }]}
          placeholder={placeholder}
          onChangeText={onChange}
          value={value}
          placeholderTextColor={placeholderTextColor || "#ced0d4"}
          editable={!read_only}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          keyboardType={numberOnly ? "numeric" : "numbers-and-punctuation"}
        />
        {icon}
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
    backgroundColor: "transparent",
    paddingHorizontal: normalize(6),
    fontFamily: "nunito-bold",
    zIndex: 10,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: normalize(8),
  },

  input: {
    fontSize: normalize(12),
    fontFamily: "nunito-medium",
    borderColor: "transparent",
    letterSpacing: 1,
    marginLeft: normalize(6),
    flex: 1,
  },

  errorText: {
    marginBottom: normalize(4),
    marginLeft: normalize(6),
    fontSize: normalize(10),
    color: "#f02849",
  },
});

export default InputItem;
