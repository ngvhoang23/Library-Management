import { createStackNavigator } from "@react-navigation/stack";
import BookGroupsScreen from "../../screens/ReaderScreens/BookGroupsScreen";
import MainHeader from "../../components/MainHeader";
import BookBorrowingManDashBoard from "../../screens/ReaderScreens/BookBorrowingManDashBoard";
import ProfileScreen from "../../screens/ReaderScreens/ProfileScreen";
import BookDetailScreen from "../../screens/ReaderScreens/BookDetailScreen";
import EditProfileScreen from "../../screens/ReaderScreens/EditProfileScreen";
import SettingScreen from "../../screens/ReaderScreens/SettingScreen";
import ChangeUserPasswordScreen from "../../screens/ReaderScreens/ChangeUserPasswordScreen";
import ChangeEmailScreen from "../../screens/ReaderScreens/ChangeEmailScreen";
import EnterEmailCodeScreen from "../../screens/ReaderScreens/EnterEmailCodeScreen";
import BookGroupSearchResult from "../../screens/ReaderScreens/BookGroupSearchResult";
import HomeScreen from "../../screens/ReaderScreens/HomeScreen";
import BooksByCategoryScreen from "../../screens/ReaderScreens/BooksByCategoryScreen";
import BooksByCategorySearchResult from "../../screens/ReaderScreens/BooksByCategorySearchResult";
import BookBorrowingSearchResult from "../../screens/ReaderScreens/BookBorrowingSearchResult";
import FineDetailScreen from "../../screens/ReaderScreens/FineDetailScreen";
import OverdueBookListScreen from "../../screens/ReaderScreens/OverdueBookListScreen";
import BorrowedBookDetailScreen from "../../screens/ReaderScreens/BorrowedBookDetailScreen";
import AvailableBooksScreen from "../../screens/ReaderScreens/AvailableBooksScreen";
import NotificationsScreen from "../../screens/ReaderScreens/NotificationsScreen";

const Stack = createStackNavigator();

const screenOptionStyle = {};

const HomeStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ header: (props) => <MainHeader {...props} transparent /> }}
      />
      <Stack.Screen
        name="Book Search Result"
        component={BookGroupSearchResult}
        options={{ header: (props) => <MainHeader title="Kết quả tìm kiếm" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Book Detail"
        component={BookDetailScreen}
        options={{ header: (props) => <MainHeader title="Chi tiết sách" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Book By Category"
        component={BooksByCategoryScreen}
        options={{ header: (props) => <MainHeader title="Sách" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Book By Category Search Result"
        component={BooksByCategorySearchResult}
        options={{ header: (props) => <MainHeader title="Kết quả tìm kiếm" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Available Books"
        component={AvailableBooksScreen}
        options={{ header: (props) => <MainHeader title="Sách có sẵn" {...props} is_stack /> }}
      />
      <Stack.Screen
        name="Borrowed Book Detail"
        component={BorrowedBookDetailScreen}
        options={{ header: (props) => <MainHeader title="Chi tiết mượn trả sách" {...props} is_stack /> }}
      />
    </Stack.Navigator>
  );
};

const BookStackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={screenOptionStyle}
      initialRouteName="Book Groups"
      options={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Book Groups"
        component={BookGroupsScreen}
        options={{ header: (props) => <MainHeader title="Sách" {...props} /> }}
      />

      <Stack.Screen
        name="Book Detail"
        component={BookDetailScreen}
        options={{ header: (props) => <MainHeader title="Chi tiết sách" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Book Search Result"
        component={BookGroupSearchResult}
        options={{ header: (props) => <MainHeader title="Kết quả tìm kiếm" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Available Books"
        component={AvailableBooksScreen}
        options={{ header: (props) => <MainHeader title="Sách có sẵn" {...props} is_stack /> }}
      />
    </Stack.Navigator>
  );
};

const BookBorrowingStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Book Borrowing"
        component={BookBorrowingManDashBoard}
        options={{ header: (props) => <MainHeader title="Sách đang mượn" {...props} /> }}
      />
      <Stack.Screen
        name="Borrowing Books Search Result"
        component={BookBorrowingSearchResult}
        options={{ header: (props) => <MainHeader title="Kết quả tìm kiếm" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Borrowed Book Detail"
        component={BorrowedBookDetailScreen}
        options={{ header: (props) => <MainHeader title="Chi tiết mượn trả sách" {...props} is_stack /> }}
      />
    </Stack.Navigator>
  );
};

const FineManStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName="Book Borrowing">
      <Stack.Screen
        name="Fine Detail"
        component={FineDetailScreen}
        options={{ header: (props) => <MainHeader title="Tiền phạt" {...props} /> }}
      />

      <Stack.Screen
        name="Overdue Books Detail"
        component={OverdueBookListScreen}
        options={{ header: (props) => <MainHeader title="Sách quá hạn" {...props} is_stack /> }}
      />
    </Stack.Navigator>
  );
};

const NotificationStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName="Notifications">
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ header: (props) => <MainHeader title="Thông báo" {...props} /> }}
      />
      <Stack.Screen
        name="Borrowed Book Detail"
        component={BorrowedBookDetailScreen}
        options={{ header: (props) => <MainHeader title="Chi tiết mượn trả sách" {...props} is_stack /> }}
      />
      <Stack.Screen
        name="Fine Detail"
        component={FineDetailScreen}
        options={{ header: (props) => <MainHeader title="Tiền phạt" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Overdue Books Detail"
        component={OverdueBookListScreen}
        options={{ header: (props) => <MainHeader title="Sách quá hạn" {...props} is_stack /> }}
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
        options={{ header: (props) => <MainHeader title="Cấu hình" {...props} is_stack /> }}
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
  BookStackNavigation,
  BookBorrowingStackNavigation,
  NotificationStackNavigation,
  ProfileStackNavigation,
  HomeStackNavigation,
  FineManStackNavigation,
};
