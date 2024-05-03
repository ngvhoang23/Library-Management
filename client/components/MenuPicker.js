import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Button, TextInput, View, Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/global.js";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { normalize } from "../defined_function/index.js";

function MenuPickers({ _styles, lableTitle, errorText, options, onChange, initIndex, border, read_only, onPress }) {
  const initRerender = useRef(false);
  const genderPickerRef = useRef();
  const [val, setVal] = useState();

  function openGenderPicker() {
    genderPickerRef.current.focus();
  }

  function closeGenderPicker() {
    genderPickerRef.current.blur();
  }

  useEffect(() => {
    if (options?.length > 0 && initIndex >= 0) {
      if (initRerender.current) {
        return;
      }
      initRerender.current = true;
      setVal(options[initIndex]);
    }
  }, [options, initIndex]);

  return (
    <View style={[_styles, styles.wrapper, { borderWidth: border ? 1 : 0 }]}>
      <Text style={[styles.lableTitle, { backgroundColor: border ? "#fff" : "transparent" }]}>{lableTitle}</Text>
      <TouchableOpacity
        activeOpacity={1.0}
        onPress={() => {
          if (!read_only) {
            openGenderPicker();
          }
          onPress && onPress();
        }}
        style={styles.container}
      >
        <Text style={[globalStyles.input, styles.input, { marginTop: border ? normalize(4) : normalize(6) }]}>
          {val?.title}
        </Text>
        <FontAwesome name="angle-down" style={styles.icon} size={normalize(16)} color="#949498" />
      </TouchableOpacity>
      {errorText && <Text style={[styles.errorText]}>{errorText}</Text>}

      {options?.length > 0 && !read_only && (
        <View style={styles.genderPicker}>
          <Picker
            ref={genderPickerRef}
            selectedValue={val?.value}
            onValueChange={(selectedValue, selectedIndex) => {
              onChange(selectedValue, selectedIndex);
              setVal(options[selectedIndex]);
            }}
            enabled={false}
            dropdownIconColor={"#fff"}
            dropdownIconRippleColor={"#fff"}
            pickerStyleType={{ display: "none" }}
            style={{ display: "none" }}
          >
            {options?.map((option, index) => {
              return <Picker.Item key={option.value} label={option.title} value={option.value} />;
            })}
          </Picker>
        </View>
      )}
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

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  icon: { marginRight: normalize(8) },

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
    fontSize: normalize(12),
    fontFamily: "nunito-regular",
    borderColor: "transparent",
    letterSpacing: 1,
    color: "#676768",
    marginLeft: normalize(6),
  },
  errorText: {
    marginBottom: normalize(4),
    marginLeft: normalize(6),
    fontSize: normalize(9),
    color: "#f02849",
  },
  genderPicker: {
    // display: "none",
    // backgroundColor: "red",
  },
});

export default MenuPickers;
