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
import ReaderItem from "../../components/ReaderItem";

function ReaderSearchResults({ route, navigation }) {
  const { search_value, placeholder } = route.params;

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
            .get(`http://10.0.2.2:5000/users/readers/searching/${search_value}`, config)
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
          <View style={styles.readerList}>
            {results.map((item, index) => {
              return (
                <ReaderItem
                  key={index}
                  _style={[styles.readerItem]}
                  data={item}
                  onPress={() =>
                    navigation.navigate("Reader Detail", {
                      reader_info: item,
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
    width: "44%",
    padding: normalize(10),
    margin: 10,
    borderRadius: normalize(10),
  },

  messageText: {
    marginTop: normalize(30),
    fontFamily: "nunito-medium",
    fontSize: normalize(14),
    letterSpacing: 4,
    color: "#aaabaf",
  },
});

export default ReaderSearchResults;