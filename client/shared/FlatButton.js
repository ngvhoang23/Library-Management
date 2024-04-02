import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

export default function FlatButton({ text, _styles, onPress, fontSize }) {
  return (
    <TouchableOpacity style={[_styles, styles.wrapper]} onPress={onPress}>
      <View style={[styles.button]}>
        <Text style={{ ...styles.buttonText, fontSize: fontSize }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 10,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontFamily: "nunito-bold",
    color: "#fff",
    textTransform: "uppercase",
    fontSize: 16,
    textAlign: "center",
  },
});
