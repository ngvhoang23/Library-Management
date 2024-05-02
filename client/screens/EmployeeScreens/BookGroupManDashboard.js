import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Button, Image, FlatList, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { globalStyles } from "../../styles/global";
import axios from "axios";
import FlatButton from "../../shared/FlatButton";
import { useIsFocused } from "@react-navigation/native";
import ReaderItem from "../../components/ReaderItem";
import SearchBar from "../../components/SearchBar";
import { SCREEN_WIDTH, _retrieveData, normalize } from "../../defined_function";
import BookItem from "../../components/BookItem";
import BookGroupItem from "../../components/BookGroupItem";
import AddUserBtn from "../../components/AddUserBtn";
import FilterItem from "../../components/FilterItem";
import { AntDesign, Feather, Entypo } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { Picker } from "@react-native-picker/picker";
import SlideDownAnimation from "../../components/SlideDownAnimation";

const titles = ["123", "1234", "123 55555555555554 5", "12"];

function BookGroupManDashboard({ navigation }) {
  const authorPickerRef = useRef();
  const categoryPickerRef = useRef();

  function openAuthorPicker() {
    authorPickerRef.current.focus();
  }

  function openCategoryPicker() {
    categoryPickerRef.current.focus();
  }

  const [books, setBooks] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const isFocused = useIsFocused();

  const [filteredBooks, setFilteredBooks] = useState([]);

  const [categoryFilters, setCategoryFilters] = useState();
  const [authorFilters, setAuthorFilters] = useState();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState({ id: -1, title: "All" });
  const [selectedAuthorFilter, setSelectedAuthorFilter] = useState({ id: -1, title: "All" });

  const [isShowFilter, setIsShowFilter] = useState(false);

  const [s_title, sets_title] = useState(0);

  useEffect(() => {
    setSearchValue("");

    if (isFocused) {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const config = {
            headers: { Authorization: `Bearer ${access_token}` },
          };
          axios
            .get(`http://10.0.2.2:5000/books/book-groups`, config)
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
    setSearchValue("");

    if (isFocused) {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const config = {
            headers: { Authorization: `Bearer ${access_token}` },
          };
          axios
            .get(`http://10.0.2.2:5000/books/authors`, config)
            .then((result) => {
              setAuthorFilters([{ author_id: -1, author_name: "All" }, ...result.data]);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
        });

      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const config = {
            headers: { Authorization: `Bearer ${access_token}` },
          };
          axios
            .get(`http://10.0.2.2:5000/books/categories`, config)
            .then((result) => {
              setCategoryFilters([{ category_id: -1, category_name: "All" }, ...result.data]);
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
    const author_id = selectedAuthorFilter?.id;
    const category_id = selectedCategoryFilter?.id;

    if (author_id == -1 && category_id == -1) {
      setFilteredBooks(books);
      return;
    }

    let filtered = [];
    if (author_id && author_id !== -1) {
      filtered = books.filter((book) => book.author_id === author_id);
    }

    if (category_id && category_id !== -1) {
      if (author_id && author_id !== -1) {
        filtered = filtered.filter((book) => book.category_id === category_id);
      } else {
        filtered = books.filter((book) => book.category_id === category_id);
      }
    }
    setFilteredBooks(filtered);
  }, [selectedAuthorFilter, selectedCategoryFilter, books]);

  const onSearch = () => {
    navigation.navigate("Book Group Search Result", {
      search_value: searchValue,
      placeholder: "search books...",
    });
  };

  const getBookQuantityByCategory = (category_id) => {
    if (category_id === -1) {
      return books.length;
    }
    return books.filter((book) => book.category_id === category_id).length;
  };

  const getBookQuantityByAuthor = (author_id) => {
    if (author_id === -1) {
      return books.length;
    }
    return books.filter((book) => book.author_id === author_id).length;
  };

  return (
    <View style={styles.wrapper}>
      <SearchBar
        _styles={styles.searchBar}
        placeholder="search books..."
        value={searchValue}
        onChange={(value) => setSearchValue(value)}
        onSearch={onSearch}
      />

      <View style={styles.filterBtnContainer}>
        <FilterItem
          _styles={styles.openFilterBtn}
          title={`Filter (${(selectedAuthorFilter?.id !== -1 ? 1 : 0) + (selectedCategoryFilter?.id !== -1 ? 1 : 0)})`}
          onPress={() => setIsShowFilter((prev) => !prev)}
          icon={<AntDesign name="filter" size={normalize(16)} color={"#6c60ff"} />}
          right_icon={
            isShowFilter ? (
              <Entypo name="chevron-thin-down" size={normalize(16)} color={"#8c8c8d"} />
            ) : (
              <Entypo name="chevron-thin-right" size={normalize(16)} color={"#8c8c8d"} />
            )
          }
        />
      </View>

      {isShowFilter && (
        <SlideDownAnimation>
          <View style={styles.filterWrapper}>
            <FilterItem
              _styles={styles.filterBtn}
              title={selectedCategoryFilter?.title}
              onPress={openCategoryPicker}
              subTitle={`${getBookQuantityByCategory(selectedCategoryFilter?.id)} books`}
              icon={<FontAwesomeIcon icon={faLayerGroup} size={normalize(16)} color={"#6c60ff"} />}
              right_icon={<Entypo name="chevron-thin-right" size={normalize(16)} color={"#8c8c8d"} />}
            />

            <FilterItem
              _styles={styles.filterBtn}
              title={selectedAuthorFilter?.title}
              onPress={openAuthorPicker}
              subTitle={`${getBookQuantityByAuthor(selectedAuthorFilter?.id)} books`}
              icon={<Feather name="user" size={normalize(16)} color={"#6c60ff"} />}
              right_icon={<Entypo name="chevron-thin-right" size={normalize(16)} color={"#8c8c8d"} />}
            />

            <View style={styles.menuPicker}>
              <Picker
                ref={authorPickerRef}
                selectedValue={selectedAuthorFilter?.id}
                onValueChange={(selectedValue, selectedIndex) => {
                  setSelectedAuthorFilter({ id: selectedValue, title: authorFilters[selectedIndex].author_name });
                }}
              >
                {authorFilters?.map((author) => {
                  return <Picker.Item key={author.author_id} label={author.author_name} value={author.author_id} />;
                })}
              </Picker>
            </View>

            <View style={styles.menuPicker}>
              <Picker
                ref={categoryPickerRef}
                selectedValue={selectedCategoryFilter?.id}
                onValueChange={(selectedValue, selectedIndex) => {
                  setSelectedCategoryFilter({ id: selectedValue, title: categoryFilters[selectedIndex].category_name });
                }}
              >
                {categoryFilters?.map((category) => {
                  return (
                    <Picker.Item
                      key={category.category_id}
                      label={category.category_name}
                      value={category.category_id}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
        </SlideDownAnimation>
      )}

      <View style={styles.titleLine}>
        <Text style={styles.title}>Book Groups</Text>
        <Text style={styles.line}></Text>
      </View>

      <ScrollView>
        <View style={styles.bookList}>
          {filteredBooks.map((book, index) => {
            return (
              <BookGroupItem
                key={book.book_detail_id}
                _style={[styles.bookItem]}
                cover_photo={book.cover_photo}
                book_name={book.book_name}
                author={book.author_name}
                borrowed_books={5}
                total_books={12}
                onPress={() =>
                  navigation.navigate("Book Group Detail", {
                    book_info: book,
                  })
                }
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
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  filterWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginTop: normalize(10),
  },

  filterBtnContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  openFilterBtn: {
    width: "40%",
    marginTop: normalize(10),
    marginLeft: normalize(10),
  },

  filterBtn: {
    width: "90%",
    marginBottom: normalize(10),
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

  addBookGroupBtn: {
    width: "100%",
    marginTop: normalize(8),
  },

  titleLine: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: normalize(10),
    marginTop: normalize(8),
    marginBottom: normalize(8),
  },
  title: {
    fontFamily: "nunito-bold",
    color: "#8c8c8d",
    fontSize: normalize(9),
    marginRight: normalize(6),
  },
  line: {
    width: "100%",
    height: normalize(1.3),
    borderBottomWidth: 0.5,
    borderColor: "#ced0d4",
  },

  menuPicker: {
    display: "none",
  },
});

export default BookGroupManDashboard;