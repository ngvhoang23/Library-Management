import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import InputItem from "../../components/InputItem";
import AvatarPicker from "../../components/AvatarPicker";
import { ScrollView } from "react-native-gesture-handler";
import FlatButton from "../../shared/FlatButton";
import LoadingModal from "../../components/LoadingModal";
import PreviewInfoItem from "../../components/PreviewInfoItem";
import {
  FontAwesome,
  MaterialIcons,
  Feather,
  Fontisto,
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome6,
  EvilIcons,
  SimpleLineIcons,
  Entypo,
  Ionicons,
} from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import AlertModal from "../../components/AlertModal";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import { SCREEN_WIDTH, _retrieveData, normalize } from "../../defined_function";
import { LinearGradient } from "expo-linear-gradient";

function BookGroupDetailScreen({ route, navigation }) {
  const { book_info } = route.params;
  const { book_detail_id } = book_info;

  const isFocused = useIsFocused();

  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });
  const [bookInfo, setBookInfo] = useState({});

  useEffect(() => {
    _retrieveData("ACCESS_TOKEN")
      .then((access_token) => {
        const config = {
          params: { book_detail_id },
          headers: { Authorization: `Bearer ${access_token}` },
        };

        if (isFocused) {
          axios
            .get(`http://10.0.2.2:5000/books/book-groups/${book_detail_id}`, config)
            .then((result) => {
              console.log(result.data);
              setBookInfo(result.data[0]);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isFocused]);

  const {
    book_name,
    price,
    published_date,
    description,
    publish_com,
    author_name,
    category_name,
    cover_photo,
    for_reader,
  } = bookInfo;

  const handleDeleteBookGroup = () => {
    setIsLoading(true);
    _retrieveData("ACCESS_TOKEN")
      .then((access_token) => {
        const configurations = {
          method: "DELETE",
          url: `http://10.0.2.2:5000/books/book-groups/${book_detail_id}`,
          data: { book_detail_id: book_detail_id },
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

  return (
    <ImageBackground source={require("../../assets/images/page_bg2.jpg")} style={styles.wrapper}>
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <ImageBackground source={require("../../assets/images/page_bg.jpg")} style={[styles.headerWrapper]}>
          <TouchableOpacity
            style={[styles.headerContainer]}
            onPress={() => navigation.navigate("Edit Book Group", { book_info: bookInfo })}
          >
            <View style={[styles.bookInfo, styles.elevation]}>
              <Text style={styles.bookNameHeader} numberOfLines={3}>
                {book_name}
              </Text>
              {author_name && <Text style={styles.authorNameHeader}>by {author_name}</Text>}
              {description && (
                <Text style={styles.desContent} numberOfLines={3}>
                  {description}
                </Text>
              )}
            </View>
            <View style={styles.bookCoverPhoto}>
              <Image source={{ uri: `http://10.0.2.2:5000/${cover_photo}` }} style={styles.avatarPreview} />
              <FlatButton _styles={styles.editBtn} text="Sửa">
                <AntDesign name="edit" size={normalize(12)} color="#fff" />
              </FlatButton>
            </View>
          </TouchableOpacity>
        </ImageBackground>

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="Tên sách"
          value={book_name}
          multiline
          icon={<Ionicons name="book-outline" size={normalize(16)} color="#3c3c3c" />}
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="Giá"
          value={price?.toString()}
          icon={<MaterialIcons name="attach-money" size={normalize(16)} color="#3c3c3c" />}
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="Ngày xuất bản"
          value={published_date ? new Date(published_date).toISOString().split("T")[0] : ""}
          icon={<Fontisto name="date" size={normalize(16)} color="#3c3c3c" />}
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="Mô tá"
          value={description}
          multiline
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="Nhà xuất bản"
          value={publish_com}
          icon={<SimpleLineIcons name="cloud-upload" size={normalize(16)} color="#3c3c3c" />}
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="Dành cho"
          value={`${for_reader == 1 ? "Sinh viên" : for_reader == 2 ? "Giảng viên" : "Tất cả"}`}
          icon={<AntDesign name="user" size={normalize(16)} color="#3c3c3c" />}
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="Tác giả"
          value={author_name}
          icon={<AntDesign name="user" size={normalize(16)} color="#3c3c3c" />}
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.input]}
          textStyles={{ color: "#676768" }}
          lableTitle="Danh mục"
          value={category_name}
          icon={<MaterialIcons name="checklist-rtl" size={normalize(16)} color="#3c3c3c" />}
          read_only
        />
      </ScrollView>

      <View style={styles.options}>
        <FlatButton
          _styles={styles.openBookListBtn}
          text="Danh sách các sách"
          onPress={() => navigation.navigate("Book List", { book_info: bookInfo })}
        >
          <Entypo name="open-book" size={normalize(14)} color="#fff" />
        </FlatButton>
        <FlatButton _styles={styles.deleteBtn} text="Xóa nhóm sách" onPress={handleDeleteBookGroup} />
      </View>

      <LoadingModal visible={isLoading} />
      <AlertModal
        onClose={() => setResultStatus({ isSuccess: 0, visible: false })}
        isSuccess={resultStatus?.isSuccess}
        visible={resultStatus?.visible ? true : false}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: SCREEN_WIDTH,
  },

  headerWrapper: {
    flex: 1,
    marginBottom: normalize(20),
  },

  headerContainer: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    position: "relative",
    marginTop: normalize(10),
    padding: normalize(10),
    paddingLeft: normalize(20),
    paddingTop: normalize(20),
    paddingBottom: normalize(30),
  },

  bookCoverPhoto: {
    marginRight: normalize(10),
  },

  avatarPreview: {
    width: normalize(100),
    height: normalize(140),
    borderRadius: normalize(8),
  },

  bookInfo: {
    width: "50%",
    borderRadius: normalize(10),
  },

  bookNameHeader: {
    fontFamily: "nunito-bold",
    fontSize: normalize(18),
    letterSpacing: normalize(2),
    color: "#3c3c3c",
  },

  authorNameHeader: {
    width: "100%",
    fontFamily: "nunito-medium",
    fontSize: normalize(10),
    letterSpacing: normalize(2),
    marginBottom: normalize(4),
    color: "#6c60ff",
  },

  desContent: {
    fontFamily: "nunito-medium",
    fontSize: normalize(10),
    color: "#676768",
    marginTop: normalize(6),
  },

  editBtn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e74fd",
    position: "absolute",
    padding: normalize(6),
    left: normalize(-14),
    top: normalize(-6),
  },

  headerTitle: {
    fontFamily: "nunito-medium",
    fontSize: normalize(18),
    width: "100%",
    marginLeft: normalize(40),
  },

  avatarPicker: {
    width: "100%",
    marginBottom: normalize(20),
  },

  formContainer: {
    width: "100%",
    height: normalize(420),
    flex: 1,
    flexGrow: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  input: {
    marginBottom: normalize(20),
    width: "100%",
    marginBottom: normalize(30),
    paddingRight: normalize(20),
    paddingLeft: normalize(16),
  },

  openBookListBtn: {
    height: normalize(32),
    width: "46%",
    paddingVertical: 0,
    marginRight: normalize(10),
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c60ff",
    borderRadius: normalize(40),
  },

  deleteBtn: {
    height: normalize(32),
    width: "46%",
    paddingVertical: 0,
    marginLeft: normalize(10),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f02849",
    borderRadius: normalize(40),
  },

  options: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    paddingHorizontal: normalize(16),
    marginBottom: normalize(10),
    marginTop: normalize(10),
  },
});

export default BookGroupDetailScreen;