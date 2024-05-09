import { StyleSheet, Text, View } from "react-native";
import { useUserInfoContext } from "../../context/userInfoContext";
import UserInfoTag from "../../components/UserInfoTag";
import OptionProfileItem from "../../components/OptionProfileItem";
import { Ionicons, Feather, SimpleLineIcons, EvilIcons } from "@expo/vector-icons";
import { normalize } from "../../defined_function";

function ProfileScreen({ navigation }) {
  const { user, setUser } = useUserInfoContext();

  const { full_name, user_avatar, role, email_address } = user;

  return (
    <View style={styles.wrapper}>
      <UserInfoTag
        full_name={full_name}
        email={email_address}
        role={role}
        user_avatar={user_avatar}
        onEdit={() => navigation.navigate("Edit Profile")}
      />
      <View style={styles.optionContainer}>
        <OptionProfileItem
          _styles={styles.optionItem}
          icon={<Ionicons name="settings-outline" size={normalize(20)} color="#6c60ff" />}
          title={"Cài đặt"}
          description={"Đổi mật khẩu, email,..."}
          onPress={() => navigation.navigate("Settings")}
        />

        <OptionProfileItem
          _styles={styles.optionItem}
          icon={<SimpleLineIcons name="bell" size={normalize(20)} color="#6c60ff" />}
          title={"Thông báo"}
          description={"Thông báo mượn trả sách, thanh toán nợ,.."}
          onPress={() => navigation.navigate("Notifications", { screen: "Notifications" })}
        />
      </View>
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
  },

  optionContainer: {
    paddingTop: normalize(10),
  },

  optionItem: {
    width: "100%",
  },
});

export default ProfileScreen;
