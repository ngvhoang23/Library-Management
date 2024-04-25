import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Image, FlatList, SafeAreaView, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";
import axios from "axios";
import FlatButton from "../../shared/FlatButton";
import { useIsFocused } from "@react-navigation/native";
import ReaderItem from "../../components/ReaderItem";
import SearchBar from "../../components/SearchBar";
import { SCREEN_WIDTH, _retrieveData, normalize } from "../../defined_function";
import BookItem from "../../components/BookItem";
import { AntDesign } from "@expo/vector-icons";
import LoadingModal from "../../components/LoadingModal";
import AlertModal from "../../components/AlertModal";

function BookListDashBoard({ route, navigation }) {
  const { book_info } = route.params;
  const { book_detail_id } = book_info;

  const [books, setBooks] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const isFocused = useIsFocused();

  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });

  const [isDeletingMode, setIsDeletingMode] = useState(false);
  const [deletingBooks, setDeletingBooks] = useState([]);

  useEffect(() => {
    setSearchValue("");

    if (isFocused) {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const config = {
            headers: { Authorization: `Bearer ${access_token}` },
            params: { book_detail_id },
          };
          axios
            .get(`http://10.0.2.2:5000/books/${book_detail_id}`, config)
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

  useEffect(() => {
    setDeletingBooks([]);
  }, [isDeletingMode]);

  const handleDeleteBooks = () => {
    setIsLoading(true);
    _retrieveData("ACCESS_TOKEN")
      .then((access_token) => {
        const configurations = {
          method: "DELETE",
          url: `http://10.0.2.2:5000/books/`,
          data: { deleting_books: deletingBooks },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        };
        axios(configurations)
          .then((result) => {
            setResultStatus({ isSuccess: 1, visible: true });
            navigation.goBack();
          })
          .catch((err) => {
            setResultStatus({ isSuccess: 0, visible: true });
            console.log("err", err);
          })
          .finally((result) => {
            setIsLoading(false);
          });
      })
      .catch((err) => {
        setResultStatus({ isSuccess: 0, visible: true });
        console.log(err);
      })
      .finally((result) => {
        setIsLoading(false);
      });
  };

  const onSearch = () => {
    navigation.navigate("Book Search Result", {
      search_value: searchValue,
      book_detail_id: book_detail_id,
      placeholder: "search books by position...",
    });
  };

  return (
    <View style={styles.wrapper}>
      {!isDeletingMode && (
        <SearchBar
          _styles={styles.searchBar}
          placeholder="search books by position..."
          value={searchValue}
          onChange={(value) => setSearchValue(value)}
          onSearch={onSearch}
        />
      )}

      {isDeletingMode && (
        <FlatButton _styles={styles.submitBtn} text={`delete (${deletingBooks.length})`} onPress={handleDeleteBooks} />
      )}
      {isDeletingMode && (
        <FlatButton _styles={styles.leaveModeBtn} onPress={() => setIsDeletingMode(false)}>
          <AntDesign name="close" size={normalize(20)} color="#fff" />
        </FlatButton>
      )}

      <ScrollView Style={styles.listWrapper}>
        <View style={styles.bookList}>
          {books.map((book, index) => {
            return (
              <BookItem
                key={book.book_id}
                _style={[styles.bookItem]}
                have_position
                checking={isDeletingMode}
                is_checked={deletingBooks?.some((book_id) => book_id === book.book_id)}
                data={book}
                onLongPress={() => {
                  setIsDeletingMode(true);
                }}
                onPress={() => {
                  if (isDeletingMode) {
                    const check = deletingBooks?.some((book_id) => book_id === book.book_id);
                    if (check) {
                      setDeletingBooks(deletingBooks.filter((deletingBook) => deletingBook !== book.book_id));
                    } else {
                      setDeletingBooks((prev) => [...prev, book.book_id]);
                    }
                  } else {
                    navigation.navigate("Edit Book", {
                      book_info: book,
                    });
                  }
                }}
              />
            );
          })}
        </View>
      </ScrollView>

      {!isDeletingMode && (
        <FlatButton
          text="Add Books"
          _styles={styles.addBookBtn}
          fontSize={normalize(10)}
          onPress={() => navigation.navigate("Add Books", { book_detail_info: book_info })}
        >
          <AntDesign name="book" size={normalize(14)} color="#fff" />
        </FlatButton>
      )}
      <LoadingModal visible={isLoading} />
      <AlertModal
        onClose={() => setResultStatus({ isSuccess: 0, visible: false })}
        isSuccess={resultStatus?.isSuccess}
        visible={resultStatus?.visible ? true : false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
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

  submitBtn: {
    width: "60%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f02849",
    padding: normalize(20),
    paddingVertical: normalize(10),
    position: "absolute",
    bottom: normalize(20),
    zIndex: 10,
  },

  leaveModeBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: normalize(-30),
    right: normalize(20),
    zIndex: 10,
  },

  addBookBtn: {
    padding: normalize(10),
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: normalize(20),
    right: normalize(20),
    borderRadius: normalize(40),
    backgroundColor: "#6c60ff",
  },
});

export default BookListDashBoard;