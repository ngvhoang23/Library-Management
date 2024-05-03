import { Image, ImageBackground, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import FlatButton from "../../shared/FlatButton";
import { AntDesign, FontAwesome6, Feather } from "@expo/vector-icons";
import { normalize } from "../../defined_function";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import LoadingModal from "../../components/LoadingModal";
import AlertModal from "../../components/AlertModal";

function AvatarPickerScreen({ route, navigation }) {
  const { user_id, user_name } = route.params;

  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0]);
      console.log(result.assets[0]);
    }
  };

  return (
    <ImageBackground source={require("../../assets/images/page_bg1.jpg")} style={{ flex: 1 }}>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.header}>
          <FlatButton _styles={styles.backBtn} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={normalize(20)} color="#3c3c3c" />
          </FlatButton>
          <Text style={styles.headerTitle}>Select Your Avatar</Text>
        </View>

        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          <FlatButton _styles={styles.editBtn}>
            <AntDesign name="edit" size={normalize(20)} color="#fff" />
          </FlatButton>
          {avatar ? (
            <Image source={{ uri: avatar?.uri }} style={styles.avatar} />
          ) : (
            <Image source={require("../../assets/images/default_avatar.jpg")} style={styles.avatar} />
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <View style={styles.progressContainer}>
            <View style={[styles.dot, { backgroundColor: "#6c60ff" }]}></View>
            <View style={[styles.dot, {}]}></View>
          </View>

          <View style={styles.btnContainer}>
            <FlatButton
              _styles={styles.submitBtn}
              text="Next"
              fontSize={normalize(12)}
              onPress={() => navigation.navigate("AddUserInfo", { avatar, user_name, user_id })}
            >
              <Feather style={{ marginLeft: normalize(10) }} name="arrow-right" size={normalize(18)} color="#fff" />
            </FlatButton>
          </View>
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

  avatarContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: normalize(1000),
    position: "relative",
    elevation: 20,
    shadowColor: "#52006A",
  },

  editBtn: {
    position: "absolute",
    borderRadius: normalize(10),
    backgroundColor: "#6c60ff",
    padding: normalize(6),
    zIndex: 10,
    right: normalize(6),
    top: normalize(6),
    elevation: 2,
    shadowColor: "#52006A",
    borderColor: "#ccc",
  },

  avatar: {
    width: normalize(140),
    height: normalize(140),
    borderRadius: normalize(1000),
  },

  footer: {
    width: "100%",
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
    marginBottom: normalize(30),
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

export default AvatarPickerScreen;
