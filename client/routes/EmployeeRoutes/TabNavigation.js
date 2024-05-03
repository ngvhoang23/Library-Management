import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  AddBookStackNavigation,
  AddBorrowBookStackNavigation,
  AddReaderStackNavigation,
  BookManStackNavigation,
  BorrowedBookManStackNavigation,
  BorrowersManagementDashboardStackNavigation,
  FineManStackNavigation,
  ProfileStackNavigation,
  ReaderManStackNavigation,
} from "./StackNavigator";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { normalize } from "../../defined_function";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBook, faBookMedical, faChartLine, faCommentDollar, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { AntDesign, Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const BorrowerManTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        unmountOnBlur: true,
        headerShown: false,
        tabBarStyle: {
          height: normalize(50),
          paddingTop: normalize(8),
          paddingBottom: normalize(4),
        },
        tabBarLabelStyle: {
          fontSize: normalize(12),
          fontFamily: "nunito-medium",
        },
        tabBarInactiveTintColor: "#3c3c3c",
        tabBarActiveTintColor: "#6c60ff",
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={BorrowersManagementDashboardStackNavigation}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ focused, color, size }) => {
            return <AntDesign name="home" size={normalize(16)} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Borrow Book Tab"
        component={AddBorrowBookStackNavigation}
        options={{
          tabBarLabel: "Borrow Book",
          tabBarIcon: ({ focused, color, size }) => {
            return <MaterialCommunityIcons name="book-plus-outline" size={normalize(16)} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const ReaderManTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        unmountOnBlur: true,
        headerShown: false,
        tabBarStyle: {
          height: normalize(44),
          paddingTop: normalize(6),
          paddingBottom: normalize(4),
          activeTintColor: "red",
        },
        tabBarLabelStyle: {
          fontSize: normalize(10),
          fontFamily: "nunito-medium",
        },
        tabBarInactiveTintColor: "#3c3c3c",
        tabBarActiveTintColor: "#6c60ff",
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={ReaderManStackNavigation}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ focused, color, size }) => {
            return <AntDesign name="home" size={normalize(16)} color={focused ? "#6c60ff" : "#3c3c3c"} />;
          },
        }}
      />
      <Tab.Screen
        name="Add Reader"
        component={AddReaderStackNavigation}
        options={{
          tabBarLabel: "Add Reader",
          tabBarIcon: ({ focused, color, size }) => {
            return <Feather name="user-plus" size={normalize(16)} color={focused ? "#6c60ff" : "#3c3c3c"} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const BookManTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        unmountOnBlur: true,
        headerShown: false,
        tabBarStyle: {
          height: normalize(44),
          paddingTop: normalize(6),
          paddingBottom: normalize(4),
        },
        tabBarLabelStyle: {
          fontSize: normalize(10),
          fontFamily: "nunito-medium",
        },
        tabBarInactiveTintColor: "#3c3c3c",
        tabBarActiveTintColor: "#6c60ff",
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={BookManStackNavigation}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ focused, color, size }) => {
            return <AntDesign name="home" size={normalize(16)} color={focused ? "#6c60ff" : "#3c3c3c"} />;
          },
        }}
      />
      <Tab.Screen
        name="Add Book Group"
        component={AddBookStackNavigation}
        options={{
          tabBarLabel: "Add Book Group",
          tabBarIcon: ({ focused, color, size }) => {
            return <Ionicons name="book-outline" size={normalize(16)} color={focused ? "#6c60ff" : "#3c3c3c"} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const BorrowedBookManTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Borrowed Books Tab"
      screenOptions={{
        unmountOnBlur: true,
        headerShown: false,
        tabBarStyle: {
          height: normalize(44),
          paddingTop: normalize(6),
          paddingBottom: normalize(4),
        },
        tabBarLabelStyle: {
          fontSize: normalize(12),
          fontFamily: "nunito-medium",
        },
        tabBarInactiveTintColor: "#3c3c3c",
        tabBarActiveTintColor: "#6c60ff",
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tab.Screen
        name="Borrowed Books Tab"
        component={BorrowedBookManStackNavigation}
        options={{
          tabBarLabel: "Borrowed Books",
          tabBarIcon: ({ focused, color, size }) => {
            return <AntDesign name="home" size={normalize(16)} color={focused ? "#6c60ff" : "#3c3c3c"} />;
          },
        }}
      />
      <Tab.Screen
        name="Fine Management Tab"
        component={FineManStackNavigation}
        options={{
          tabBarLabel: "Fine Management",
          tabBarIcon: ({ focused, color, size }) => {
            return <MaterialIcons name="attach-money" size={normalize(16)} color={focused ? "#6c60ff" : "#3c3c3c"} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const ProfileTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        unmountOnBlur: true,
        headerShown: false,
        tabBarStyle: {
          height: normalize(50),
          paddingTop: normalize(8),
          paddingBottom: normalize(4),
          display: "none",
        },
        tabBarLabelStyle: {
          fontSize: normalize(12),
          fontFamily: "nunito-medium",
        },
        tabBarInactiveTintColor: "#3c3c3c",
        tabBarActiveTintColor: "#6c60ff",
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={ProfileStackNavigation}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ focused, color, size }) => {
            return <AntDesign name="home" size={normalize(16)} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export {
  BorrowerManTabNavigation,
  ReaderManTabNavigation,
  BookManTabNavigation,
  BorrowedBookManTabNavigation,
  ProfileTabNavigation,
};
