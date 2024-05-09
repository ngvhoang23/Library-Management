import { ScrollView, StyleSheet, View } from "react-native";
import OverdueBookItem from "../../components/OverdueBookItem";
import { normalize } from "../../defined_function";

function OverdueBookListScreen({ route, navigation }) {
  const { overdue_books } = route.params;

  const renderBooks = () => {
    return overdue_books.map((book) => {
      return (
        <OverdueBookItem
          key={book.book_id}
          _style={styles.bookItem}
          book_name={book.book_name}
          cover_photo={book.cover_photo}
          position={book.position}
          total_fine={Math.abs(Math.floor((new Date(book.return_date) - new Date()) / (1000 * 60 * 60 * 24)) * 1000)}
          onPress={() => {}}
        />
      );
    });
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formWrapper}>{renderBooks()}</View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: normalize(20),
    paddingBottom: 0,
  },
  formWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },

  formContainer: {
    width: "100%",
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  bookItem: {
    width: "100%",
    marginBottom: normalize(6),
    borderBottomWidth: 1,
    borderColor: "#d8dde7",
    paddingBottom: normalize(14),
  },
});

export default OverdueBookListScreen;