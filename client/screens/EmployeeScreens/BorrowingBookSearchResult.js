import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Image, FlatList, SafeAreaView } from "react-native";
import { globalStyles } from "../../styles/global";
import axios from "axios";
import EmployeeItem from "../../components/EmployeeItem";
import FlatButton from "../../shared/FlatButton";
import { useIsFocused } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import { SCREEN_WIDTH, _retrieveData, normalize } from "../../defined_function";
import { ScrollView } from "react-native-gesture-handler";
import BookItem from "../../components/BookItem";
import BookBorrowedHorizontal from "../../components/BookBorrowedHorizontal";

function BorrowingBookSearchResult({ route, navigation }) {
  const { search_value, placeholder } = route.params;

  const [results, setResults] = useState([]);
  const [searchValue, setSearchValue] = useState(search_value);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      handleSearch(search_value);
    }
  }, [search_value, isFocused]);

  const handleSearch = (search_value) => {
    _retrieveData("ACCESS_TOKEN")
      .then((access_token) => {
        const config = {
          params: {
            search_value,
          },
          headers: { Authorization: `Bearer ${access_token}` },
        };

        if (search_value) {
          axios
            .get(`http://10.0.2.2:5000/borrowed-books/borrowing-books/searching/${search_value}`, config)
            .then((result) => {
              setResults([...result.data]);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={styles.wrapper}>
      <SearchBar
        _styles={styles.searchBar}
        placeholder={placeholder}
        value={searchValue}
        onChange={(value) => setSearchValue(value)}
        onSearch={() => handleSearch(searchValue)}
      />
      <ScrollView style={styles.resultContainer}>
        {results?.length > 0 ? (
          <View style={styles.bookList}>
            {results.map((book, index) => {
              const total_day = Math.round(
                (new Date(book.return_date) - new Date(book.borrow_date)) / (1000 * 3600 * 24),
              );
              const remain_day = Math.round((new Date(book.return_date) - new Date()) / (1000 * 3600 * 24));
              return (
                <BookBorrowedHorizontal
                  key={book.borrow_id}
                  _styles={[styles.bookItem]}
                  cover_photo={book.cover_photo}
                  book_name={book.book_name}
                  position={book.position}
                  total_day={total_day}
                  remain_day={remain_day}
                  book_detail_id={book.book_detail_id}
                  onPress={() =>
                    navigation.navigate("Borrowing Book Detail", {
                      borrow_id: book.borrow_id,
                    })
                  }
                />
              );
            })}
          </View>
        ) : (
          <Text style={styles.messageText}>There are no results</Text>
        )}
      </ScrollView>
    </View>
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

  searchBar: {
    width: "100%",
  },

  resultContainer: {
    flex: 1,
    width: "100%",
  },

  bookList: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingVertical: normalize(14),
    paddingRight: normalize(14),
    paddingLeft: normalize(14),
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
  },

  bookItem: {
    width: "100%",
    paddingTop: normalize(10),
    marginBottom: normalize(10),
    borderBottomWidth: 0.5,
    borderColor: "#ced0d4",
    borderStyle: "solid",
  },

  messageText: {
    marginTop: normalize(30),
    fontFamily: "nunito-medium",
    fontSize: normalize(14),
    letterSpacing: 4,
    color: "#aaabaf",
    textAlign: "center",
  },
});

export default BorrowingBookSearchResult;