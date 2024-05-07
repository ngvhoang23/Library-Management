import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import EmpManDashboard from "../../screens/AdminScreens/EmpManDashboard";
import AddEmployeScreen from "../../screens/AdminScreens/AddEmployeScreen";
import MainHeader from "../../components/MainHeader";
import EmployeeDetailScreen from "../../screens/AdminScreens/EmployeeDetailScreen";
import EditEmployeeScreen from "../../screens/AdminScreens/EditEmployeeScreen";
import ChangePasswordScreen from "../../screens/AdminScreens/ChangePasswordScreen";
import ReaderManDashboard from "../../screens/AdminScreens/ReaderManDashboard";
import AddReaderScreen from "../../screens/AdminScreens/AddReaderScreen";
import ReaderDetailScreen from "../../screens/AdminScreens/ReaderDetailScreen";
import EditReaderScreen from "../../screens/AdminScreens/EditReaderScreen";
import SearchResults from "../../screens/AdminScreens/SearchResults";
import ReaderSearchResults from "../../screens/AdminScreens/ReaderSearchResults";
import ProfileScreen from "../../screens/AdminScreens/ProfileScreen";
import EditProfileScreen from "../../screens/AdminScreens/EditProfileScreen";
import SettingScreen from "../../screens/AdminScreens/SettingScreen";
import ChangeEmailScreen from "../../screens/AdminScreens/ChangeEmailScreen";
import EnterEmailCodeScreen from "../../screens/AdminScreens/EnterEmailCodeScreen";
import ChangeUserPasswordScreen from "../../screens/AdminScreens/ChangeUserPasswordScreen";
import EmployeeSearchResults from "../../screens/AdminScreens/EmployeeSearchResults";

const Stack = createStackNavigator();

const screenOptionStyle = {};

const EmpManStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName="Employees">
      <Stack.Screen
        name="Employees"
        component={EmpManDashboard}
        options={{
          header: (props) => <MainHeader title="Nhân viên" {...props} />,
        }}
      />
      <Stack.Screen
        name="Add Employees"
        component={AddEmployeScreen}
        options={{ header: (props) => <MainHeader title="Thêm nhân viên" {...props} is_stack /> }}
      />
      <Stack.Screen
        name="Employee Detail"
        component={EmployeeDetailScreen}
        options={{ header: (props) => <MainHeader title="Chi tiết nhân viên" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Edit Employee"
        component={EditEmployeeScreen}
        options={{ header: (props) => <MainHeader title="Sửa nhân viên" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Change Password"
        component={ChangePasswordScreen}
        options={{ header: (props) => <MainHeader title="Đổi mật khẩu nhân viên" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Search Results"
        component={EmployeeSearchResults}
        options={{ header: (props) => <MainHeader title="Kết quả tìm kiếm" {...props} is_stack /> }}
      />
    </Stack.Navigator>
  );
};

const AddEmpStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName="Add Employees">
      <Stack.Screen
        name="Add Employees"
        component={AddEmployeScreen}
        options={{ header: (props) => <MainHeader title="Thêm nhân viên" {...props} /> }}
      />
    </Stack.Navigator>
  );
};

const ReaderManStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName="Readers">
      <Stack.Screen
        name="Readers"
        component={ReaderManDashboard}
        options={{
          header: (props) => <MainHeader title="Độc giả" {...props} />,
        }}
      />

      <Stack.Screen
        name="Reader Detail"
        component={ReaderDetailScreen}
        options={{ header: (props) => <MainHeader title="Chi tiết độc giả" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Edit Reader"
        component={EditReaderScreen}
        options={{ header: (props) => <MainHeader title="Sửa độc giả" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Change Password"
        component={ChangePasswordScreen}
        options={{ header: (props) => <MainHeader title="Đổi mật khẩu độc giả" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Reader Search Results"
        component={ReaderSearchResults}
        options={{ header: (props) => <MainHeader title="Kết quả tìm kiếm" {...props} is_stack /> }}
      />
    </Stack.Navigator>
  );
};

const AddReaderStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName="Add Readers">
      <Stack.Screen
        name="Add Readers"
        component={AddReaderScreen}
        options={{ header: (props) => <MainHeader title="Thêm độc giả" {...props} /> }}
      />
    </Stack.Navigator>
  );
};

const ProfileStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ header: (props) => <MainHeader title="Profile" {...props} /> }}
      />

      <Stack.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={{ header: (props) => <MainHeader title="Sửa Profile" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Settings"
        component={SettingScreen}
        options={{ header: (props) => <MainHeader title="Cài đặt" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Change Password"
        component={ChangeUserPasswordScreen}
        options={{ header: (props) => <MainHeader title="Đổi mật khẩu" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Change Email"
        component={ChangeEmailScreen}
        options={{ header: (props) => <MainHeader title="Đổi Email" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Enter Email Code"
        component={EnterEmailCodeScreen}
        options={{ header: (props) => <MainHeader title="Nhập mã xác nhận email" {...props} is_stack /> }}
      />
    </Stack.Navigator>
  );
};

export {
  EmpManStackNavigator,
  ReaderManStackNavigation,
  AddEmpStackNavigator,
  AddReaderStackNavigation,
  ProfileStackNavigation,
};
