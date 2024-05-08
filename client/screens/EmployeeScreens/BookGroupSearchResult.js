import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Image, FlatList, SafeAreaView } from "react-native";
import { globalStyles } from "../../styles/global";
import axios from "axios";
import EmployeeItem from "../../components/EmployeeItem";
import FlatButton from "../../shared/FlatButton";
import { useIsFocused } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import { SCREEN_WIDTH, _retrieveData, normalize } from "../../defined_function";
import BookItem from "../../components/BookItem";
import { ScrollView } from "react-native-gesture-handler";
import BookGroupItem from "../../components/BookGroupItem";

function BookGroupSearchResult({ route, navigation }) {
  const { search_value, placeholder, navigate_to } = route.params;

  const [results, setResults] = useState([]);
  const [searchValue, setSearchValue] = useState(search_value);
  useEffect(() => {
    handleSearch(search_value);
  }, [search_value]);

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
            .get(`http://10.0.2.2:5000/books/book-groups/searching/${search_value}`, config)
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
            {results.map((item, index) => {
              return (
                <BookGroupItem
                  key={item.book_detail_id}
                  _style={[styles.bookItem]}
                  cover_photo={item.cover_photo}
                  book_name={item.book_name}
                  author={item.author_name}
                  borrowed_books={5}
                  total_books={12}
                  onPress={() =>
                    navigation.navigate("Book Group Detail", {
                      book_info: item,
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
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
  },

  searchBar: {
    width: "100%",
  },

  bookList: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingVertical: normalize(14),
    paddingHorizontal: normalize(6),
    overflow: "scroll",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  bookItem: {
    width: "46%",
    margin: normalize(5),
    marginBottom: normalize(16),
  },

  messageText: {
    marginTop: normalize(30),
    fontFamily: "nunito-medium",
    fontSize: normalize(14),
    letterSpacing: 4,
    color: "#aaabaf",
  },
});

export default BookGroupSearchResult;