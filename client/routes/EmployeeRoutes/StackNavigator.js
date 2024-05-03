import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainHeader from "../../components/MainHeader";
import ReaderManDashboard from "../../screens/EmployeeScreens/ReaderManDashboard";
import AddReaderScreen from "../../screens/EmployeeScreens/AddReaderScreen";
import ReaderDetailScreen from "../../screens/EmployeeScreens/ReaderDetailScreen";
import EditReaderScreen from "../../screens/EmployeeScreens/EditReaderScreen";
import ChangePasswordScreen from "../../screens/EmployeeScreens/ChangePasswordScreen";
import SearchResults from "../../screens/EmployeeScreens/SearchResults";
import BookGroupManDashboard from "../../screens/EmployeeScreens/BookGroupManDashboard";
import AddBookGroupScreen from "../../screens/EmployeeScreens/AddBookGroupScreen";
import EditBookGroupScreen from "../../screens/EmployeeScreens/EditBookGroupScreen";
import BookGroupDetailScreen from "../../screens/EmployeeScreens/BookGroupDetailScreen";
import BookListDashBoard from "../../screens/EmployeeScreens/BookListDashBoard";
import EditBookScreen from "../../screens/EmployeeScreens/EditBookScreen";
import AddBookScreen from "../../screens/EmployeeScreens/AddBookScreen";
import BookGroupSearchResult from "../../screens/EmployeeScreens/BookGroupSearchResult";
import BookSearchResult from "../../screens/EmployeeScreens/BookSearchResult";
import SelectBorrowerScreen from "../../screens/EmployeeScreens/SelectBorrowerScreen";
import AddBorrowBookScreen from "../../screens/EmployeeScreens/AddBorrowBookScreen";
import SelectBookGroupScreen from "../../screens/EmployeeScreens/SelectBookGroupScreen";
import SelectBorrowedBookScreen from "../../screens/EmployeeScreens/SelectBorrowedBookScreen";
import BorrowingBooksByBorrowersScreen from "../../screens/EmployeeScreens/BorrowingBooksByBorrowersScreen";
import BorrowingBookDetailScreen from "../../screens/EmployeeScreens/BorrowingBookDetailScreen";
import BorrowersManDashboard from "../../screens/EmployeeScreens/BorrowersManDashboard";
import BorrowersSearchResult from "../../screens/EmployeeScreens/BorrowersSearchResult";
import BorrowingBookByBorrowerSearchResult from "../../screens/EmployeeScreens/BorrowingBookByBorrowerSearchResult";
import BorrowingReaderSearchResult from "../../screens/EmployeeScreens/BorrowingReaderSearchResult";
import BookGroupToBorrowSearchResult from "../../screens/EmployeeScreens/BookGroupToBorrowSearchResult";
import BookToBorrowSearchResult from "../../screens/EmployeeScreens/BookToBorrowSearchResult";
import BorrowedBookManDashBoard from "../../screens/EmployeeScreens/BorrowedBookManDashBoard";
import FineManDashBoard from "../../screens/EmployeeScreens/FineManDashBoard";
import BorrowingBookSearchResult from "../../screens/EmployeeScreens/BorrowingBookSearchResult";
import FineDetailScreen from "../../screens/EmployeeScreens/FineDetailScreen";
import OverdueBookListScreen from "../../screens/EmployeeScreens/OverdueBookListScreen";
import FineSearchResult from "../../screens/EmployeeScreens/FineSearchResult";
import ReaderSearchResults from "../../screens/EmployeeScreens/ReaderSearchResults";
import ProfileScreen from "../../screens/EmployeeScreens/ProfileScreen";
import EditProfileScreen from "../../screens/EmployeeScreens/EditProfileScreen";
import SettingScreen from "../../screens/EmployeeScreens/SettingScreen";
import ChangeUserPasswordScreen from "../../screens/EmployeeScreens/ChangeUserPasswordScreen";
import ChangeEmailScreen from "../../screens/EmployeeScreens/ChangeEmailScreen";
import EnterEmailCodeScreen from "../../screens/EmployeeScreens/EnterEmailCodeScreen";
import NotificationsScreen from "../../screens/EmployeeScreens/NotificationsScreen";
import StatisticScreen from "../../screens/EmployeeScreens/StatisticScreen";
import StatisticByCategoryScreen from "../../screens/EmployeeScreens/StatisticByCategoryScreen";
import StatisticOverdueBookScreen from "../../screens/EmployeeScreens/StatisticOverdueBookScreen";
import StatisticBookStatusScreen from "../../screens/EmployeeScreens/StatisticBookStatusScreen";

const Stack = createStackNavigator();

const screenOptionStyle = {};

const ReaderManStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName="Readers">
      <Stack.Screen
        name="Readers"
        component={ReaderManDashboard}
        options={{
          header: (props) => <MainHeader title="Quán lý độc giả" {...props} />,
        }}
      />

      <Stack.Screen
        name="Add Readers"
        component={AddReaderScreen}
        options={{ header: (props) => <MainHeader title="Thêm độc giả" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Reader Detail"
        component={ReaderDetailScreen}
        options={{ header: (props) => <MainHeader title="Thông tin độc giả" {...props} is_stack /> }}
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

const BookManStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Book Groups"
        component={BookGroupManDashboard}
        options={{
          header: (props) => <MainHeader title="Quản lý nhóm sách" {...props} />,
        }}
      />
      <Stack.Screen
        name="Add Book Groups"
        component={AddBookGroupScreen}
        options={{
          header: (props) => <MainHeader title="Thêm nhóm sách" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Add Books"
        component={AddBookScreen}
        options={{
          header: (props) => <MainHeader title="Thêm sách" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Book Group Detail"
        component={BookGroupDetailScreen}
        options={{
          header: (props) => <MainHeader title="Chi tiết nhóm sách" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Edit Book Group"
        component={EditBookGroupScreen}
        options={{
          header: (props) => <MainHeader title="Sửa nhóm sách" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Book List"
        component={BookListDashBoard}
        options={{
          header: (props) => <MainHeader title="Quản lý sách" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Edit Book"
        component={EditBookScreen}
        options={{
          header: (props) => <MainHeader title="Sửa sách" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Book Group Search Result"
        component={BookGroupSearchResult}
        options={{
          header: (props) => <MainHeader title="Kết quả tìm kiếm" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Book Search Result"
        component={BookSearchResult}
        options={{
          header: (props) => <MainHeader title="Kết quả tìm kiếm" {...props} is_stack />,
        }}
      />
    </Stack.Navigator>
  );
};

const AddBookStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Add Book Groups"
        component={AddBookGroupScreen}
        options={{
          header: (props) => <MainHeader title="Thêm nhóm sách" {...props} />,
        }}
      />
    </Stack.Navigator>
  );
};

const BorrowersManagementDashboardStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName="Borrowers Management">
      <Stack.Screen
        name="Borrowers Management"
        component={BorrowersManDashboard}
        options={{
          header: (props) => <MainHeader title="Quản lý người mượn" {...props} />,
        }}
      />

      <Stack.Screen
        name="Borrowing Books"
        component={BorrowingBooksByBorrowersScreen}
        options={{
          header: (props) => <MainHeader title="Mượn sách" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Borrowing Book Detail"
        component={BorrowingBookDetailScreen}
        options={{
          header: (props) => <MainHeader title="Chi tiết mượn trả sách" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Borrowers Search Result"
        component={BorrowingReaderSearchResult}
        options={{
          header: (props) => <MainHeader title="Kết quả tìm kiếm" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Borrowing Books Search Result"
        component={BorrowingBookByBorrowerSearchResult}
        options={{
          header: (props) => <MainHeader title="Kết quả tìm kiếm" {...props} is_stack />,
        }}
      />
    </Stack.Navigator>
  );
};

const AddBorrowBookStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName="Select Borrower">
      <Stack.Screen
        name="Select Borrower"
        component={SelectBorrowerScreen}
        options={{
          header: (props) => <MainHeader title="Chọn độc giả" {...props} />,
        }}
      />

      <Stack.Screen
        name="Select Book Group"
        component={SelectBookGroupScreen}
        options={{
          header: (props) => <MainHeader title="Chọn nhóm sách" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Select Borrowed Book"
        component={SelectBorrowedBookScreen}
        options={{
          header: (props) => <MainHeader title="Chọn sách" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Borrow Book"
        component={AddBorrowBookScreen}
        options={{
          header: (props) => <MainHeader title="Cho mượn sách" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Borrowers Search Result"
        component={BorrowersSearchResult}
        options={{
          header: (props) => <MainHeader title="Kết quả tìm kiếm" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Book Group To Borrow Search Result"
        component={BookGroupToBorrowSearchResult}
        options={{
          header: (props) => <MainHeader title="Kết quả tìm kiếm" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Book To Borrow Search Result"
        component={BookToBorrowSearchResult}
        options={{
          header: (props) => <MainHeader title="Kết quả tìm kiếm" {...props} is_stack />,
        }}
      />
    </Stack.Navigator>
  );
};

const BorrowedBookManStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Borrowed Books"
        component={BorrowedBookManDashBoard}
        options={{
          header: (props) => <MainHeader title="Quản lý sách mượn" {...props} />,
        }}
      />

      <Stack.Screen
        name="Borrowing Book Detail"
        component={BorrowingBookDetailScreen}
        options={{
          header: (props) => <MainHeader title="Chi tiết mượn trả sách" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Borrowing Books Search Result"
        component={BorrowingBookSearchResult}
        options={{
          header: (props) => <MainHeader title="Kết quả tìm kiếm" {...props} is_stack />,
        }}
      />
    </Stack.Navigator>
  );
};

const FineManStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Fine"
        component={FineManDashBoard}
        options={{
          header: (props) => <MainHeader title="Tiền phạt" {...props} />,
        }}
      />

      <Stack.Screen
        name="Fine Detail"
        component={FineDetailScreen}
        options={{
          header: (props) => <MainHeader title="Chi tiết phiếu phạt" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Overdue Books Detail"
        component={OverdueBookListScreen}
        options={{
          header: (props) => <MainHeader title="Sách quá hạn" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Fine Search Result"
        component={FineSearchResult}
        options={{
          header: (props) => <MainHeader title="Kết quả tìm kiếm" {...props} is_stack />,
        }}
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
        options={{ header: (props) => <MainHeader title="Chỉnh sửa Profile" {...props} is_stack /> }}
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
        options={{ header: (props) => <MainHeader title="Đổi email" {...props} is_stack /> }}
      />

      <Stack.Screen
        name="Enter Email Code"
        component={EnterEmailCodeScreen}
        options={{ header: (props) => <MainHeader title="Nhập mã xác nhận email" {...props} is_stack /> }}
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
        name="Fine Detail"
        component={FineDetailScreen}
        options={{
          header: (props) => <MainHeader title="Chi tiết phiếu phạt" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Overdue Books Detail"
        component={OverdueBookListScreen}
        options={{
          header: (props) => <MainHeader title="Sách trả trễ" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Borrowing Book Detail"
        component={BorrowingBookDetailScreen}
        options={{
          header: (props) => <MainHeader title="Chi tiết mượn trả sách" {...props} is_stack />,
        }}
      />
    </Stack.Navigator>
  );
};

const StatisticStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Home"
        component={StatisticScreen}
        options={{
          header: (props) => <MainHeader title="Phân tích" {...props} />,
        }}
      />

      <Stack.Screen
        name="Statistic By Category"
        component={StatisticByCategoryScreen}
        options={{
          header: (props) => <MainHeader title="Thống kê mượn trả sách" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Statistic Overdue Books"
        component={StatisticOverdueBookScreen}
        options={{
          header: (props) => <MainHeader title="Thống kê sách trả trễ" {...props} is_stack />,
        }}
      />

      <Stack.Screen
        name="Statistic Book Status"
        component={StatisticBookStatusScreen}
        options={{
          header: (props) => <MainHeader title="Thống kê trạng thái sách" {...props} is_stack />,
        }}
      />
    </Stack.Navigator>
  );
};

export {
  ReaderManStackNavigation,
  AddReaderStackNavigation,
  BookManStackNavigation,
  BorrowersManagementDashboardStackNavigation,
  AddBookStackNavigation,
  AddBorrowBookStackNavigation,
  BorrowedBookManStackNavigation,
  FineManStackNavigation,
  ProfileStackNavigation,
  NotificationStackNavigation,
  StatisticStackNavigation,
};
