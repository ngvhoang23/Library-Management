import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../../screens/SharedScreens/WelcomeScreen";
import RegisterScreen from "../../screens/SharedScreens/RegisterScreen";
import LoginScreen from "../../screens/SharedScreens/LoginScreen";
import AvatarPickerScreen from "../../screens/SharedScreens/AvatarPickerScreen";
import AddUserInfoScreen from "../../screens/SharedScreens/AddUserInfoScreen";
import EnterEmailVerifyCodeScreen from "../../screens/SharedScreens/EnterEmailVerifyCodeScreen";
import EnterEmailToResetPasswordScreen from "../../screens/SharedScreens/EnterEmailToResetPasswordScreen";
import ResetPasswordScreen from "../../screens/SharedScreens/ResetPasswordScreen";

const Stack = createStackNavigator();

const AuthStackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Welcome"
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />

      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="AvatarPicker" component={AvatarPickerScreen} />
      <Stack.Screen name="AddUserInfo" component={AddUserInfoScreen} />
      <Stack.Screen
        name="EnterEmailVerifyCode"
        component={EnterEmailVerifyCodeScreen}
        options={{ unmountOnBlur: true }}
      />
      <Stack.Screen
        name="EnterEmailToResetPassword"
        component={EnterEmailToResetPasswordScreen}
        options={{ unmountOnBlur: true }}
      />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ unmountOnBlur: true }} />
    </Stack.Navigator>
  );
};

export { AuthStackNavigation };
