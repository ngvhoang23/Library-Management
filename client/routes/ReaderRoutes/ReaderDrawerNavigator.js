import React, { useEffect } from "react";

import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import { useAuthContext } from "../../context/roleContext";
import { useUserInfoContext } from "../../context/userInfoContext";
import axios from "axios";
import { SCREEN_HEIGHT, SCREEN_WIDTH, _retrieveData, normalize } from "../../defined_function/index";
import { BookBorrowingTabNavigation } from "./TabNavigation";
import { Image, StyleSheet, Text, View } from "react-native";
import { AntDesign, MaterialCommunityIcons, Feather, MaterialIcons, Entypo, FontAwesome } from "@expo/vector-icons";
import {
  BookStackNavigation,
  HomeStackNavigation,
  NotificationStackNavigation,
  ProfileStackNavigation,
} from "./StackNavigator";
import { useNotiContext } from "../../context/notiContext";
import socket from "../../socket";

const Drawer = createDrawerNavigator();

const ReaderDrawerNavigator = () => {
  const { auth, setAuth } = useAuthContext();

  const { user, setUser } = useUserInfoContext();

  const { notiQuantity, setNotiQuantity } = useNotiContext();

  useEffect(() => {
    _retrieveData("ACCESS_TOKEN").then((access_token) => {
      const config = {
        headers: { Authorization: `Bearer ${access_token}` },
      };

      axios
        .get(`http://10.0.2.2:5000/users/user-info`, config)
        .then((result) => {
          setUser(result.data);
          socket.emit("addUser", result.data.user_id);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }, []);

  useEffect(() => {
    socket.on("borrow-book", (borrow_info) => {
      setNotiQuantity((prev) => prev + 1);
    });

    socket.on("pay-fine", (pay_info) => {
      setNotiQuantity((prev) => prev + 1);
    });
  }, [socket]);

  return user ? (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          width: SCREEN_WIDTH / 1.45,
          height: SCREEN_HEIGHT,
        },

        drawerItemStyle: {
          marginBottom: normalize(10),
          paddingVertical: normalize(6),
          paddingHorizontal: normalize(4),
        },
      }}
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView
            {...props}
            style={{
              position: "relative",
            }}
            contentContainerStyle={{
              flexDirection: "column",
              justifyContent: "flex-start",
              height: SCREEN_HEIGHT,
            }}
          >
            <DrawerItemList {...props} />
            <View style={styles.bottomDrawerSection}>
              <DrawerItem
                label={"Đăng xuất"}
                onPress={() => setAuth(null)}
                labelStyle={{
                  fontSize: normalize(12),
                  fontFamily: "nunito-bold",
                  flexDirection: "column",
                  color: "#f02849",
                }}
                icon={({ focused, color, size }) => (
                  <MaterialIcons name="logout" size={normalize(19)} color={"#f02849"} />
                )}
              />
            </View>
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen
        name={user?.full_name || "user_name"}
        drawerItemPress={() => {}}
        component={ProfileStackNavigation}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          drawerActiveTintColor: "#6c60ff",
          drawerInactiveTintColor: "#3c3c3c",
          drawerLabelStyle: {
            fontSize: normalize(11),
            fontFamily: "nunito-bold",
            color: "#3c3c3c",
          },
          drawerLabel: ({ focused, color, size }) => (
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.full_name}</Text>
              <Text style={styles.role}>{user?.reader_type == "student" ? "Sinh viên" : "Giảng viên"}</Text>
            </View>
          ),
          drawerIcon: ({ focused, color, size }) => (
            <View style={styles.userAvatarContainer}>
              <Image source={{ uri: `http://10.0.2.2:5000${user?.user_avatar}` }} style={styles.userAvatar} />
            </View>
          ),
        }}
      />

      <Drawer.Screen
        name="Home"
        component={HomeStackNavigation}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          drawerLabelStyle: {
            fontSize: normalize(11),
            fontFamily: "nunito-bold",
          },
          drawerLabel: ({ focused, color, size }) => (
            <View style={styles.notiTitleWrapper}>
              <Text style={styles.userName}>Trang chủ</Text>
            </View>
          ),
          drawerIcon: ({ focused, color, size }) => <AntDesign name="home" size={normalize(19)} color={color} />,
        }}
      />

      <Drawer.Screen
        name="Books"
        component={BookStackNavigation}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          drawerActiveTintColor: "#6c60ff",
          drawerInactiveTintColor: "#3c3c3c",
          drawerLabelStyle: {
            fontSize: normalize(11),
            fontFamily: "nunito-bold",
          },
          drawerLabel: ({ focused, color, size }) => (
            <View style={styles.notiTitleWrapper}>
              <Text style={styles.userName}>Sách</Text>
            </View>
          ),
          drawerIcon: ({ focused, color, size }) => <Feather name="book-open" size={normalize(19)} color={color} />,
        }}
      />

      <Drawer.Screen
        name="Book Borrowing"
        component={BookBorrowingTabNavigation}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          drawerActiveTintColor: "#6c60ff",
          drawerInactiveTintColor: "#3c3c3c",
          drawerLabelStyle: {
            fontSize: normalize(11),
            fontFamily: "nunito-bold",
          },
          drawerLabel: ({ focused, color, size }) => (
            <View style={styles.notiTitleWrapper}>
              <Text style={styles.userName}>Sách đang mượn</Text>
            </View>
          ),
          drawerIcon: ({ focused, color, size }) => <AntDesign name="book" size={normalize(19)} color={color} />,
        }}
      />

      <Drawer.Screen
        name="Notifications"
        component={NotificationStackNavigation}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          drawerActiveTintColor: "#6c60ff",
          drawerInactiveTintColor: "#3c3c3c",
          drawerLabelStyle: {
            fontSize: normalize(11),
            fontFamily: "nunito-bold",
            backgroundColor: "yellow",
          },
          drawerLabel: ({ focused, color, size }) => (
            <View style={styles.notiTitleWrapper}>
              <Text style={styles.userName}>Thông báo</Text>
              {notiQuantity > 0 ? <View style={styles.notiDot}></View> : ""}
            </View>
          ),
          drawerIcon: ({ focused, color, size }) =>
            notiQuantity > 0 ? (
              <Image
                source={require("../../assets/images/noti_icon.gif")}
                style={{ width: normalize(20), height: normalize(20), backgroundColor: "transparent" }}
              />
            ) : (
              <FontAwesome name="bell-o" size={normalize(19)} color={color} />
            ),
        }}
      />
    </Drawer.Navigator>
  ) : (
    <View></View>
  );
};

const styles = StyleSheet.create({
  bottomDrawerSection: {
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
    flex: 1,
    paddingTop: normalize(10),
    paddingLeft: normalize(10),
    position: "absolute",
    right: 0,
    left: 0,
    bottom: normalize(10),
  },

  profileInfo: {},
  userName: {
    fontSize: normalize(11),
    fontFamily: "nunito-bold",
    color: "#3c3c3c",
  },
  role: {
    fontSize: normalize(10),
    fontFamily: "nunito-medium",
    color: "#8c8c8d",
  },

  userAvatarContainer: {
    elevation: 8,
    shadowColor: "#000",
    borderRadius: normalize(1000),
    borderWidth: 2,
    borderColor: "#6ec531",
    padding: normalize(2),
  },

  userAvatar: {
    aspectRatio: 1,
    height: normalize(30),
    borderRadius: normalize(1000),
  },

  notiTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "blue",
    flex: 1,
  },

  notiDot: {
    width: normalize(8),
    height: normalize(8),
    backgroundColor: "#f02849",
    borderRadius: normalize(1000),
  },
});
export default ReaderDrawerNavigator;
