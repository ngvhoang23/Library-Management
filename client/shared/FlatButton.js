import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { normalize } from "../defined_function";

export default function FlatButton({ text, _styles, onPress, textColor, fontSize, children }) {
  return (
    <TouchableOpacity style={[styles.wrapper, _styles]} onPress={onPress}>
      {children}
      {text && (
        <View style={[styles.button, { marginLeft: children ? normalize(6) : 0 }]}>
          <Text
            style={[
              styles.buttonText,
              { fontSize: fontSize || styles.buttonText.fontSize },
              { color: textColor || styles.buttonText.color },
            ]}
          >
            {text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: normalize(10),
  },
  button: {
    borderRadius: normalize(8),
  },
  buttonText: {
    fontFamily: "nunito-bold",
    color: "#fff",
    fontSize: normalize(9),
    textAlign: "center",
  },
});
