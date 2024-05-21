import { StyleSheet, Text, View } from "react-native";
import { normalize } from "../../defined_function";
import UsersStatistic from "../../components/UsersStatistic";
import FlatButton from "../../shared/FlatButton";
import { AntDesign, MaterialCommunityIcons, Feather, MaterialIcons, FontAwesome } from "@expo/vector-icons";

function StatisticScreen({ navigation }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Báo cáo</Text>
        <Text style={styles.dateTitle}>{new Date().toISOString().split("T")[0]}</Text>
      </View>
      <View style={styles.container}>
        <UsersStatistic />
      </View>
      <View style={styles.footer}>
        <View style={[styles.header, { marginBottom: normalize(10) }]}>
          <Text style={styles.headerTitle}>Tạo báo cáo</Text>
          <Text style={styles.dateTitle}>{new Date().toISOString().split("T")[0]}</Text>
        </View>
        <FlatButton
          _styles={styles.createStatisticBtn}
          text="Thống kê MTS theo thể loại"
          fontSize={normalize(10)}
          textColor={"#5b4cfd"}
          onPress={() => navigation.navigate("Statistic By Category")}
        >
          <AntDesign name="linechart" size={normalize(19)} color={"#5b4cfd"} />
        </FlatButton>
        <FlatButton
          _styles={styles.createStatisticBtn}
          text="Thống kê sách trả trễ"
          fontSize={normalize(10)}
          textColor={"#5b4cfd"}
          onPress={() => navigation.navigate("Statistic Overdue Books")}
        >
          <AntDesign name="linechart" size={normalize(19)} color={"#5b4cfd"} />
        </FlatButton>
        <FlatButton
          _styles={styles.createStatisticBtn}
          text="Thống kê tình trạng sách"
          fontSize={normalize(10)}
          textColor={"#5b4cfd"}
          onPress={() => navigation.navigate("Statistic Book Status")}
        >
          <AntDesign name="linechart" size={normalize(19)} color={"#5b4cfd"} />
        </FlatButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: normalize(20),
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(2),
  },
  headerTitle: {
    fontFamily: "nunito-bold",
    fontSize: normalize(16),
    color: "#3c3c3c",
  },
  dateTitle: {
    fontFamily: "nunito-medium",
    fontSize: normalize(10),
    color: "#3c3c3c",
    borderWidth: 1,
    borderColor: "#3c3c3c",
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(10),
  },

  container: {
    marginTop: normalize(10),
  },

  footer: {
    marginTop: normalize(30),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },

  createStatisticBtn: {
    width: "90%",
    height: normalize(30),
    marginTop: normalize(6),
    paddingVertical: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(108, 96, 255, 0.2)",
    borderRadius: normalize(1000),
    borderWidth: 1,
    borderColor: "#5b4cfd",
    marginBottom: normalize(6),
  },
});

export default StatisticScreen;
