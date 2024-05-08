import { StyleSheet, Text, View } from "react-native";
import FlatButton from "../../shared/FlatButton";
import socket from "../../socket";
import { useUserInfoContext } from "../../context/userInfoContext";
import BorrowingNotificationItem from "../../components/BorrowingNotificationItem";
import { _retrieveData, normalize } from "../../defined_function";
import axios from "axios";
import { useEffect, useState } from "react";
import FineNotificationItem from "../../components/FineNotificationItem";
import { ScrollView } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";
import { useNotiContext } from "../../context/notiContext";

function NotificationsScreen({ navigation }) {
  const { user, setUser } = useUserInfoContext();
  const { notiQuantity, setNotiQuantity } = useNotiContext();

  const isFocused = useIsFocused();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isFocused) {
      getNotifications();
    }
    setNotiQuantity(0);
  }, [isFocused]);

  useEffect(() => {
    if (notiQuantity > 0) {
      setNotiQuantity(0);
    }
    getNotifications();
  }, [notiQuantity]);

  const getNotifications = () => {
    _retrieveData("ACCESS_TOKEN")
      .then((access_token) => {
        const config = {
          headers: { Authorization: `Bearer ${access_token}` },
        };
        axios
          .get(`http://10.0.2.2:5000/notifications/by-employee`, config)
          .then((result) => {
            setNotifications(result.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderNotifications = () => {
    return notifications.map((noti, index) => {
      if (noti.noti_type == "borrowing") {
        const { reader_id, full_name, user_avatar, book_id, book_name, cover_photo, created_at, borrow_date } = noti;
        return (
          <BorrowingNotificationItem
            key={index}
            user_id={reader_id}
            full_name={full_name}
            user_avatar={user_avatar}
            book_id={book_id}
            book_name={book_name}
            cover_photo={cover_photo}
            borrow_date={borrow_date}
            created_at={created_at}
            onPress={() =>
              navigation.navigate("Borrowing Book Detail", {
                borrow_id: noti.borrow_id,
              })
            }
          />
        );
      } else {
        const { reader_id, full_name, user_avatar, amount_collected, created_at } = noti;

        return (
          <FineNotificationItem
            key={index}
            user_id={reader_id}
            full_name={full_name}
            user_avatar={user_avatar}
            amount_collected={amount_collected}
            created_at={created_at}
            onPress={() => navigation.navigate("Fine Detail", { reader_id })}
          />
        );
      }
    });
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>{renderNotifications()}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  container: {
    marginTop: normalize(10),
  },
});

export default NotificationsScreen;