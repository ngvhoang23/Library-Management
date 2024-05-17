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
import BookGroupItem from "../../components/BookGroupItem";

function SelectBookGroupScreen({ route, navigation }) {
  const { reader_info } = route.params;
  const { reader_type } = reader_info;
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
              reader_type,
            },
          };
          axios
            .get(`http://10.0.2.2:5000/borrowed-books/book-groups`, config)
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
    navigation.navigate("Book Group To Borrow Search Result", {
      search_value: searchValue,
      reader_type,
      reader_info,
      placeholder: "Tìm kiếm sách...",
    });
  };

  return (
    <ImageBackground source={require("../../assets/images/page_bg2.jpg")} style={styles.wrapper}>
      <SearchBar
        _styles={styles.searchBar}
        placeholder="Tìm kiếm sách..."
        value={searchValue}
        onChange={(value) => setSearchValue(value)}
        onSearch={onSearch}
      />

      <ScrollView>
        <View style={styles.bookList}>
          {books.map((book, index) => {
            return (
              <BookGroupItem
                key={book.book_detail_id}
                _style={[styles.bookItem]}
                cover_photo={book.cover_photo}
                book_name={book.book_name}
                author={book.author_name}
                borrowed_books={5}
                total_books={12}
                onPress={() => {
                  if (book.remaining <= 0) {
                    alert("There are no books available for borrowing");
                  }
                  navigation.navigate("Select Borrowed Book", {
                    book_group_info: book,
                    reader_info,
                  });
                }}
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
    marginTop: normalize(10),
  },
  bookItem: {
    width: "46%",
    margin: normalize(5),
    marginBottom: normalize(16),
  },
});

export default SelectBookGroupScreen;