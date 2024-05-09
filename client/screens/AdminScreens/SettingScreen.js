import { StyleSheet, View } from "react-native";
import OptionProfileItem from "../../components/OptionProfileItem";
import { Ionicons, Octicons, SimpleLineIcons, Entypo, MaterialIcons } from "@expo/vector-icons";
import { normalize } from "../../defined_function";

function SettingScreen({ navigation }) {
  return (
    <View style={styles.optionContainer}>
      <OptionProfileItem
        _styles={styles.optionItem}
        icon={<Entypo name="key" size={normalize(20)} color="#6c60ff" />}
        title={"Đổi mật khẩu"}
        description={"Change your passowrd"}
        onPress={() => navigation.navigate("Change Password")}
      />

      <OptionProfileItem
        _styles={styles.optionItem}
        icon={<MaterialIcons name="email" size={normalize(20)} color="#6c60ff" />}
        title={"Đổi Email"}
        description={"Change your email address"}
        onPress={() => navigation.navigate("Change Email")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: normalize(10),
  },
  optionItem: {
    width: "100%",
  },
});

export default SettingScreen;
