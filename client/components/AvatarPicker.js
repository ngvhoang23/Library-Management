import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { normalize } from "../defined_function";
import FlatButton from "../shared/FlatButton";
import { AntDesign } from "@expo/vector-icons";

function AvatarPicker({ _styles, avatar, setAvatar, onPickImage, initAvatar, title }) {
  return (
    <TouchableOpacity style={[styles.wrapper, _styles]} activeOpacity={0.5} onPress={onPickImage}>
      <View style={styles.container}>
        {avatar || initAvatar ? (
          <View
            style={{
              elevation: 8,
              shadowColor: "#52006A",
              borderRadius: normalize(1000),
            }}
          >
            <Image source={{ uri: avatar?.uri || initAvatar }} style={styles.avatarPreview} />
            <FlatButton _styles={styles.editBtn}>
              <AntDesign name="edit" size={normalize(12)} color="#fff" />
            </FlatButton>
          </View>
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    with: "100%",
    minHeight: normalize(100),
    justifyContent: "center",
    alignItems: "center",
    padding: normalize(12),
    position: "relative",
  },

  editBtn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e74fd",
    position: "absolute",
    padding: normalize(6),
    right: normalize(0),
    top: normalize(6),
  },

  title: {
    fontFamily: "nunito-medium",
    fontSize: normalize(12),
    letterSpacing: normalize(4),
    color: "#aaabaf",
  },

  avatarPreview: { width: normalize(100), height: normalize(100), borderRadius: 99999 },
});
export default AvatarPicker;
