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

function BorrowingBookByBorrowerSearchResult({ route, navigation }) {
  const { search_value, borrower_info, placeholder } = route.params;
  const { user_id: borrower_id, full_name, phone_num, user_avatar } = borrower_info;

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
            borrower_id,
          },
          headers: { Authorization: `Bearer ${access_token}` },
        };

        if (search_value) {
          axios
            .get(`http://10.0.2.2:5000/borrowed-books/borrowing-books/searching-by-borrower/${search_value}`, config)
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
          <View style={styles.empList}>
            {results.map((item, index) => {
              return (
                <BookItem
                  key={item.book_id}
                  _style={[styles.bookItem]}
                  have_position
                  overdue={new Date() > new Date(item.return_date)}
                  data={item}
                  onPress={() =>
                    navigation.navigate("Borrowing Book Detail", {
                      borrowing_book_info: {
                        ...item,
                        reader_name: full_name,
                        reader_phone_num: phone_num,
                        reader_avatar: user_avatar,
                      },
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
  },

  searchBar: {
    width: "100%",
  },

  empList: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingVertical: normalize(14),
    paddingHorizontal: normalize(6),
    overflow: "scroll",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  bookItem: {
    width: "100%",
    padding: normalize(10),
    borderRadius: normalize(10),
    marginBottom: normalize(14),
  },

  messageText: {
    marginTop: normalize(30),
    fontFamily: "nunito-medium",
    fontSize: normalize(14),
    letterSpacing: 4,
    color: "#aaabaf",
  },
});

export default BorrowingBookByBorrowerSearchResult;