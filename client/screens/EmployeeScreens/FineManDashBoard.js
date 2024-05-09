import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  FlatList,
  SafeAreaView,
  Dimensions,
  ScrollView,
  ImageBackground,
} from "react-native";
import axios from "axios";
import FlatButton from "../../shared/FlatButton";
import { useIsFocused } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import { SCREEN_HEIGHT, SCREEN_WIDTH, _retrieveData, normalize } from "../../defined_function";
import BorrowedBookItem from "../../components/BorrowedBookItem";
import { AntDesign } from "@expo/vector-icons";
import BorrowerItem from "../../components/BorrowerItem";
import DebtorItem from "../../components/DebtorItem";

function FineManDashBoard({ navigation }) {
  const [borrowers, setBorrowers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    setSearchValue("");

    if (isFocused) {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const config = {
            headers: { Authorization: `Bearer ${access_token}` },
          };
          axios
            .get(`http://10.0.2.2:5000/borrowed-books/fine`, config)
            .then((result) => {
              console.log(result.data);
              setBorrowers(result.data);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isFocused]);

  const onSearch = () => {
    navigation.navigate("Fine Search Result", {
      search_value: searchValue,
      placeholder: "Tìm kiếm độc giả...",
    });
  };

  return (
    <ImageBackground source={require("../../assets/images/page_bg1.jpg")} style={styles.wrapper}>
      <SearchBar
        _styles={styles.searchBar}
        placeholder="Tìm kiếm độc giả..."
        value={searchValue}
        onChange={(value) => setSearchValue(value)}
        onSearch={onSearch}
      />

      <ScrollView>
        <View style={styles.borrowerList}>
          {borrowers.map((borrowing, index) => {
            return (
              <DebtorItem
                key={index}
                _style={[styles.borrowerItem]}
                debtor_name={borrowing.reader_info.reader_name}
                debtor_avatar={borrowing.reader_info.reader_avatar}
                debtor_phone_num={borrowing.reader_info.reader_phone_num}
                total_fine={borrowing.total_fine - borrowing.amount_collected}
                onPress={() =>
                  navigation.navigate("Fine Detail", {
                    reader_id: borrowing?.reader_info?.reader_id,
                  })
                }
              />
            );
          })}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  borrowerList: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingVertical: normalize(14),
    paddingHorizontal: normalize(6),
    overflow: "scroll",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  borrowerItem: {
    width: "100%",
    padding: normalize(10),
    borderRadius: normalize(10),
    marginBottom: normalize(10),
  },
});

export default FineManDashBoard;