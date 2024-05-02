import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Image, FlatList, SafeAreaView, ImageBackground } from "react-native";
import { globalStyles } from "../../styles/global";
import axios from "axios";
import EmployeeItem from "../../components/EmployeeItem";
import FlatButton from "../../shared/FlatButton";
import { useIsFocused } from "@react-navigation/native";
import ReaderItem from "../../components/ReaderItem";
import SearchBar from "../../components/SearchBar";
import { SCREEN_WIDTH, _retrieveData, normalize } from "../../defined_function";
import { ScrollView } from "react-native-gesture-handler";
import BookItem from "../../components/BookItem";

function BorrowedBookManDashBoard({ route, navigation }) {
  const [books, setBooks] = useState([]);
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
            .get(`http://10.0.2.2:5000/borrowed-books/borrowing-books/`, config)
            .then((result) => {
              setBooks([...result.data]);
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
    navigation.navigate("Borrowing Books Search Result", {
      search_value: searchValue,
      placeholder: "search books by position...",
    });
  };

  return (
    <ImageBackground source={require("../../assets/images/page_bg1.jpg")} style={styles.wrapper}>
      <SearchBar
        _styles={styles.searchBar}
        placeholder="search books by position..."
        value={searchValue}
        onChange={(value) => setSearchValue(value)}
        onSearch={onSearch}
      />

      <ScrollView style={styles.listWrapper}>
        <View style={styles.bookList}>
          {books.map((book, index) => {
            return (
              <BookItem
                key={book.book_id}
                _style={[styles.bookItem]}
                have_position
                in_progess={new Date() < new Date(book.return_date)}
                overdue={new Date() >= new Date(book.return_date)}
                data={book}
                onPress={() =>
                  navigation.navigate("Borrowing Book Detail", {
                    borrow_id: book.borrow_id,
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
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
  },

  listWrapper: {
    flex: 1,
  },

  bookList: {
    width: SCREEN_WIDTH,
    flex: 1,
    height: "100%",
    paddingVertical: normalize(14),
    paddingHorizontal: normalize(14),
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  bookItem: {
    width: "100%",
    paddingTop: normalize(10),
    paddingBottom: normalize(20),
    marginBottom: normalize(10),
    borderBottomWidth: 0.5,
    borderColor: "#ced0d4",
    borderStyle: "solid",
  },
});

export default BorrowedBookManDashBoard;