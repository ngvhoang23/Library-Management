import { normalize } from "../../defined_function";
import {
  BookBorrowingStackNavigation,
  BookStackNavigation,
  FineManStackNavigation,
  NotificationStackNavigation,
  ProfileStackNavigation,
} from "./StackNavigator";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, Feather, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const BookTabNavigation = () => {
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
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={BookStackNavigation}
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

const BookBorrowingTabNavigation = () => {
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
        tabBarLabelPosition: "below-icon",
        tabBarInactiveTintColor: "#3c3c3c",
        tabBarActiveTintColor: "#6c60ff",
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={BookBorrowingStackNavigation}
        options={{
          tabBarLabel: "Borrowed Books",
          tabBarIcon: ({ focused, color, size }) => {
            return <FontAwesome6 name="book-bookmark" size={normalize(16)} color={focused ? "#6c60ff" : "#3c3c3c"} />;
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

const NotificationTabNavigation = () => {
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
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={NotificationStackNavigation}
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
        },
        tabBarLabelStyle: {
          fontSize: normalize(12),
          fontFamily: "nunito-medium",
        },
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

export { BookTabNavigation, BookBorrowingTabNavigation, NotificationTabNavigation, ProfileTabNavigation };
