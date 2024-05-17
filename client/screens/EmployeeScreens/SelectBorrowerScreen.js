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

function SelectBorrowerScreen({ navigation }) {
  const [readers, setReaders] = useState([]);
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
            .get(`http://10.0.2.2:5000/borrowed-books/borrowers`, config)
            .then((result) => {
              setReaders(result.data);
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
    navigation.navigate("Borrowers Search Result", {
      search_value: searchValue,
      placeholder: "Tìm kiếm người mượn...",
    });
  };

  return (
    <ImageBackground source={require("../../assets/images/page_bg2.jpg")} style={styles.wrapper}>
      <SearchBar
        _styles={styles.searchBar}
        placeholder="Tìm kiếm người mượn..."
        value={searchValue}
        onChange={(value) => setSearchValue(value)}
        onSearch={onSearch}
      />

      <ScrollView>
        <View style={styles.readerList}>
          {readers.map((reader, index) => {
            return (
              <ReaderItem
                key={index}
                _style={[styles.readerItem]}
                borrowed_books={reader.borrowed_books || 0}
                data={reader}
                onPress={() => {
                  if (reader.borrowed_books >= 4) {
                    alert("Độc giả đã mượn 4 quyền trong vòng 4 ngày gần đây");
                    return;
                  }
                  if (new Date(reader.expire_date) <= new Date()) {
                    alert("Thẻ độc giả hết hạn");
                    return;
                  }
                  navigation.navigate("Select Book Group", {
                    reader_info: reader,
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
  readerList: {
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

  readerItem: {
    width: "100%",
    padding: normalize(10),
    margin: normalize(8),
    borderRadius: normalize(10),
  },
});

export default SelectBorrowerScreen;