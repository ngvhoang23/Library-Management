import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import { _retrieveData, normalize } from "../../defined_function";
import { useUserInfoContext } from "../../context/userInfoContext";
import BookBorrowedHorizontal from "../../components/BookBorrowedHorizontal";
import SearchBox from "../../components/SearchBox";

function BookBorrowingManDashBoard({ navigation }) {
  const [books, setBooks] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const isFocused = useIsFocused();

  const { user, setUser } = useUserInfoContext();

  useEffect(() => {
    setSearchValue("");

    if (isFocused) {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const config = {
            headers: { Authorization: `Bearer ${access_token}` },
            params: { borrower_id: user?.user_id },
          };
          axios
            .get(`http://10.0.2.2:5000/borrowed-books/borrowing-books/${user.user_id}`, config)
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
      placeholder: "Search for Books...",
    });
  };

  return (
    <View style={styles.wrapper}>
      <SearchBox _styles={styles.searchBox} value={searchValue} setValue={setSearchValue} onSearch={onSearch} />

      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        <View style={styles.bookList}>
          {books.map((book, index) => {
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
                onPress={() => {
                  navigation.navigate("Borrowed Book Detail", { borrow_id: book.borrow_id });
                }}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  searchBox: {
    marginTop: normalize(20),
    marginBottom: normalize(10),
    width: "86%",
  },
  categoryContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  categoryItem: {
    marginRight: normalize(16),
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(100),
  },
  categoryTitle: {
    color: "#292929",
    fontFamily: "nunito-bold",
    fontSize: normalize(10),
  },
  active: {
    color: "#fff",
    backgroundColor: "#5b4cfd",
  },
  bookList: {
    width: "100%",
    flex: 1,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  bookItem: {
    width: "100%",
    padding: normalize(10),
    borderRadius: normalize(10),
    marginBottom: normalize(10),
  },
});

export default BookBorrowingManDashBoard;