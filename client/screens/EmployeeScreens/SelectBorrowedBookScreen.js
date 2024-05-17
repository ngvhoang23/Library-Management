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

function SelectBorrowedBookScreen({ route, navigation }) {
  const { reader_info, book_group_info } = route.params;
  const { book_detail_id } = book_group_info;
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
            params: {
              book_detail_id,
            },
          };
          axios
            .get(`http://10.0.2.2:5000/borrowed-books/available-books/${book_detail_id}`, config)
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
    navigation.navigate("Book To Borrow Search Result", {
      search_value: searchValue,
      book_detail_id,
      reader_info,
      placeholder: "search books by positionaa...",
    });
  };

  return (
    <ImageBackground source={require("../../assets/images/page_bg2.jpg")} style={styles.wrapper}>
      <SearchBar
        _styles={styles.searchBar}
        placeholder="search books by position..."
        value={searchValue}
        onChange={(value) => setSearchValue(value)}
        onSearch={onSearch}
      />

      <ScrollView>
        <View style={styles.bookList}>
          {books.map((book, index) => {
            return (
              <BookItem
                key={book.book_id}
                _style={[styles.bookItem]}
                have_position
                data={book}
                onPress={() =>
                  navigation.navigate("Borrow Book", {
                    book_info: book,
                    reader_info,
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
  bookList: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingVertical: normalize(14),
    paddingHorizontal: normalize(6),
    overflow: "scroll",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  bookItem: {
    width: "100%",
    padding: normalize(10),
    borderRadius: normalize(10),
    marginBottom: normalize(10),
  },
});

export default SelectBorrowedBookScreen;