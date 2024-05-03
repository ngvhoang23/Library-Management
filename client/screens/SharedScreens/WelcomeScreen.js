import { Image, StyleSheet, Text, View } from "react-native";
import { SCREEN_WIDTH, normalize } from "../../defined_function";
import FlatButton from "../../shared/FlatButton";

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.photo}>
        <Image source={require("../../assets/images/books1.png")} style={styles.bookImg} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome To GeekForGeek</Text>
        <Text style={styles.subTitle}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
      </View>
      <View style={styles.navigateBtn}>
        <FlatButton
          _styles={styles.loginBtn}
          text={"Login"}
          textColor={"#fff"}
          fontSize={normalize(14)}
          onPress={() => navigation.navigate("Login")}
        />
        <FlatButton
          _styles={styles.registerBtn}
          text={"Register"}
          textColor={"#6c60ff"}
          fontSize={normalize(14)}
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {},
  bookImg: {
    width: SCREEN_WIDTH,
    height: normalize(200),
  },
  content: {
    width: SCREEN_WIDTH / 1.2,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "nunito-bold",
    fontSize: normalize(26),
    color: "#292929",
    marginBottom: normalize(10),
  },
  subTitle: {
    fontFamily: "nunito-medium",
    fontSize: normalize(12),
    color: "#505050",
    textAlign: "center",
  },
  navigateBtn: {
    marginTop: normalize(40),
  },
  loginBtn: {
    width: SCREEN_WIDTH / 1.5,
    height: normalize(32),
    backgroundColor: "#6c60ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: normalize(10),
  },
  registerBtn: {
    width: SCREEN_WIDTH / 1.5,
    height: normalize(32),
    borderWidth: 2,
    borderColor: "#6c60ff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WelcomeScreen;
