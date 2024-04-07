import { Image, StyleSheet, Text, View } from "react-native";
import InputItem from "../../components/InputItem";
import AvatarPicker from "../../components/AvatarPicker";
import { ScrollView } from "react-native-gesture-handler";
import FlatButton from "../../shared/FlatButton";
import LoadingModal from "../../components/LoadingModal";
import PreviewInfoItem from "../../components/PreviewInfoItem";
import {
  FontAwesome,
  MaterialIcons,
  Feather,
  Fontisto,
  FontAwesome5,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { _retrieveData, normalize } from "../../defined_function";

function EmployeeDetailScreen({ route, navigation }) {
  const { emp_info } = route.params;
  const { user_id } = emp_info;

  const isFocused = useIsFocused();

  const [isShowPassword, setIsShowPassWord] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [empInfo, setEmpInfo] = useState({});

  useEffect(() => {
    _retrieveData("ACCESS_TOKEN")
      .then((access_token) => {
        const config = {
          params: { user_id },
          headers: { Authorization: `Bearer ${access_token}` },
        };

        if (isFocused) {
          axios
            .get(`http://10.0.2.2:5000/users/employees/${user_id}`, config)
            .then((result) => {
              setEmpInfo(result.data[0]);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isFocused]);

  const {
    user_avatar,
    user_name,
    password,
    full_name,
    phone_num,
    birth_date,
    email_address,
    gender,
    first_name,
    last_name,
    address,
    created_at,
  } = empInfo;

  const generateHidenPassWord = (password) => {
    let s = "";
    for (let i = 0; i < password.length; i++) {
      s += "*";
    }
    return s;
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.avatarContainer]}>
          <View>
            <Image source={{ uri: `http://10.0.2.2:5000${user_avatar}` }} style={styles.avatarPreview} />
          </View>
        </View>

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="User Name"
          value={user_name}
          icon={<FontAwesome name="user-o" size={normalize(16)} color="#949498" />}
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="Phone Number"
          value={phone_num}
          icon={<Feather name="phone-call" size={normalize(16)} color="#949498" />}
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="Gender"
          value={gender ? "Male" : "Female"}
          icon={<Fontisto name="transgender-alt" size={normalize(16)} color="#949498" />}
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="Birth Date"
          value={birth_date ? new Date(birth_date).toISOString().split("T")[0] : ""}
          icon={<FontAwesome5 name="birthday-cake" size={normalize(16)} color="#949498" />}
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="First Work Date"
          value={created_at ? new Date(created_at).toISOString().split("T")[0] : ""}
          icon={<Fontisto name="date" size={normalize(16)} color="#949498" />}
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="Email"
          value={email_address}
          icon={<Fontisto name="email" size={normalize(16)} color="#949498" />}
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="Address"
          value={address}
          icon={<Entypo name="address" size={normalize(16)} color="#949498" />}
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="Full Name"
          value={full_name}
          icon={<MaterialCommunityIcons name="smart-card-outline" size={normalize(16)} color="#949498" />}
          read_only
        />
      </ScrollView>
      <View style={styles.options}>
        <FlatButton
          _styles={styles.deleteBtn}
          text="Change Password"
          onPress={() => navigation.navigate("Change Password", { user_id: emp_info?.user_id })}
        />
        <FlatButton
          _styles={styles.editBtn}
          text="Edit"
          onPress={() => navigation.navigate("Edit Employee", { emp_info })}
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
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: normalize(20),
  },

  avatarContainer: {
    with: "100%",
    minHeight: normalize(50),
    backgroundColor: "#eee",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ced0d4",
    justifyContent: "center",
    alignItems: "center",
    padding: normalize(12),
    marginBottom: normalize(20),
  },

  avatarPreview: { width: normalize(120), height: normalize(120), borderRadius: 99999 },

  headerTitle: {
    fontFamily: "nunito-medium",
    fontSize: normalize(18),
    width: "100%",
    marginLeft: normalize(40),
  },

  avatarPicker: {
    width: "100%",
    marginBottom: normalize(20),
  },

  formWrapper: {
    width: "100%",
    margin: normalize(20),
    justifyContent: "space-between",
    alignItems: "center",
  },

  formContainer: {
    width: "90%",
    height: normalize(420),
    flex: 1,
    flexGrow: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  input: {
    marginBottom: normalize(20),
    width: "100%",
    marginBottom: normalize(30),
  },

  deleteBtn: {
    height: normalize(32),
    width: "40%",
    paddingVertical: 0,
    marginRight: normalize(10),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e74fd",
  },

  editBtn: {
    height: normalize(32),
    width: "40%",
    paddingVertical: 0,
    marginLeft: normalize(10),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e74fd",
  },

  options: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: normalize(10),
    marginTop: normalize(10),
  },
});

export default EmployeeDetailScreen;