import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Image, FlatList, SafeAreaView, ImageBackground } from "react-native";
import { globalStyles } from "../../styles/global";
import axios from "axios";
import EmployeeItem from "../../components/EmployeeItem";
import FlatButton from "../../shared/FlatButton";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import ReaderItem from "../../components/ReaderItem";
import SearchBar from "../../components/SearchBar";
import { SCREEN_WIDTH, _retrieveData, normalize } from "../../defined_function";
import { ScrollView } from "react-native-gesture-handler";
import AddUserBtn from "../../components/AddUserBtn";
import FilterItem from "../../components/FilterItem";
import { AntDesign, Feather } from "@expo/vector-icons";

function ReaderManDashboard({ navigation }) {
  const [filteredReaders, setFilteredReaders] = useState([]);
  const [readers, setReaders] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const isFocused = useIsFocused();

  const [filter, setFilter] = useState(1);

  useEffect(() => {
    setSearchValue("");

    if (isFocused) {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const config = {
            headers: { Authorization: `Bearer ${access_token}` },
          };
          axios
            .get(`http://10.0.2.2:5000/users/readers`, config)
            .then((result) => {
              setReaders([...result.data]);
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
    if (filter == 1) {
      console.log(filter);
      const readerFiltered = readers.filter((reader) => reader.reader_type === "student");
      setFilteredReaders(readerFiltered);
    } else {
      const readerFiltered = readers.filter((reader) => reader.reader_type === "lecturer");
      setFilteredReaders(readerFiltered);
    }
  }, [filter, readers]);

  const onSearch = () => {
    navigation.navigate("Reader Search Results", {
      search_value: searchValue,
      placeholder: "search readers...",
      type: "readers",
    });
  };

  return (
    <ImageBackground source={require("../../assets/images/page_bg3.jpg")} resizeMode="cover" style={styles.wrapper}>
      <SearchBar
        _styles={styles.searchBar}
        placeholder="search readers..."
        value={searchValue}
        onChange={(value) => setSearchValue(value)}
        onSearch={onSearch}
      />

      <View style={styles.filterWrapper}>
        <FilterItem
          _styles={styles.filterBtn}
          title={"Students"}
          onPress={() => setFilter(1)}
          subTitle={`${filter === 1 ? filteredReaders.length : readers.length - filteredReaders.length} students`}
          active={filter === 1}
          icon={<Feather name="user-plus" size={normalize(16)} color={filter === 1 ? "#fff" : "#3c3c3c"} />}
        />

        <FilterItem
          _styles={styles.filterBtn}
          title={"Lecturers"}
          subTitle={`${filter === 2 ? filteredReaders.length : readers.length - filteredReaders.length} lecturers`}
          onPress={() => setFilter(2)}
          active={filter === 2}
          icon={<Feather name="user-plus" size={normalize(16)} color={filter === 2 ? "#fff" : "#3c3c3c"} />}
        />
      </View>

      <View style={styles.titleLine}>
        <Text style={styles.title}>Readers</Text>
        <Text style={styles.line}></Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.readerList}>
          {filteredReaders.map((reader, index) => {
            return (
              <ReaderItem
                key={index}
                _style={[styles.readerItem]}
                data={reader}
                onPress={() =>
                  navigation.navigate("Reader Detail", {
                    reader_info: reader,
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

  searchBar: {},

  readerList: {
    width: SCREEN_WIDTH - normalize(20),
    flex: 1,
    paddingVertical: normalize(6),
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
    margin: 10,
    borderRadius: normalize(10),
  },

  filterWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: normalize(10),
  },

  filterBtn: {
    width: "40%",
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
});

export default ReaderManDashboard;