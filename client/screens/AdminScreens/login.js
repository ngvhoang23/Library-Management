import React from "react";
import { StyleSheet, View, Text, ImageBackground, Keyboard, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/global";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginForm from "../../components/loginForm";

export default function LoginScreen({ handleSubmit }) {
  return (
    <TouchableOpacity activeOpacity={1.0} onPress={Keyboard.dismiss}>
      <View>
        <ImageBackground source={require("../../assets/images/login_bg.png")} resizeMode="cover" style={styles.bg}>
          <View style={styles.header}>
            <Text style={styles.loginText}>L O G I N</Text>
          </View>
          <View style={styles.formContainer}>
            <LoginForm onSubmit={handleSubmit} />
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 140,
    marginBottom: 20,
  },

  loginText: {
    fontFamily: "nunito-bold",
    fontSize: 40,
    width: 200,
    textAlign: "center",
  },
  formContainer: {
    marginHorizontal: 40,
  },
  bg: {
    width: "100%",
    height: "100%",
  },
});
