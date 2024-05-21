import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SCREEN_WIDTH, _retrieveData, normalize } from "../../defined_function";
import UsersStatistic from "../../components/UsersStatistic";
import FlatButton from "../../shared/FlatButton";
import { AntDesign, MaterialCommunityIcons, Feather, MaterialIcons, Entypo } from "@expo/vector-icons";
import { useState } from "react";
import axios from "axios";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

import randomColor from "randomcolor";
import Table from "../../components/Table";

import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";

function StatisticByCategoryScreen() {
  const months = [
    { content: "January", value: 1 },
    { content: "February", value: 2 },
    { content: "March", value: 3 },
    { content: "April", value: 4 },
    { content: "May", value: 5 },
    { content: "June", value: 6 },
    { content: "July", value: 7 },
    { content: "August", value: 8 },
    { content: "September", value: 9 },
    { content: "October", value: 10 },
    { content: "November", value: 11 },
    { content: "December", value: 12 },
  ];

  const [data, setData] = useState();

  const [month, setMonth] = useState(months[0]);

  const [isOpenMonthPicker, setIsOpenMonthPicker] = useState(false);

  const [noDataMonth, setNoDataMonth] = useState();

  const handleSubmit = () => {
    _retrieveData("ACCESS_TOKEN").then((access_token) => {
      const config = {
        headers: { Authorization: `Bearer ${access_token}` },
        params: {
          month: month?.value,
        },
      };

      axios
        .get(`http://10.0.2.2:5000/borrowed-books/statistic/books-borrowed`, config)
        .then((result) => {
          const data = result.data.map((item) => {
            return {
              name: item.category_name,
              ...item,
              color: randomColor({
                luminosity: "bright",
                format: "rgb", // e.g. 'rgb(225,200,20)'
              }),
              legendFontColor: "#505050",
              legendFontSize: normalize(10),
            };
          });
          setNoDataMonth(month?.content);
          setData(data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const generateDataForTable = () => {
    const total = data.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0);

    return data.map((item) => {
      const ratio = (item.count / total).toFixed(2);

      return [
        { content: item.category_name, per: 50, styles: { paddingVertical: normalize(4), fontSize: normalize(10) } },
        { content: item.count, per: 20, styles: { paddingVertical: normalize(4), fontSize: normalize(10) } },
        {
          content: ((item.count / total) * 100).toFixed(2) + " %",
          per: 30,
          styles: { paddingVertical: normalize(4), fontSize: normalize(10) },
        },
      ];
    });
  };

  let generatePdf = async () => {
    const total = data.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0);

    const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <div style="padding: 10px 60px;">
        <h2 style="text-align: center; padding: 0 60px; line-height: 1.2">BÁO CÁO THỐNG KÊ MƯỢN TRẢ SÁCH THÁNG ${
          month.value
        }</h2>
          
          <table style="margin-top: 20px; width: 100%" border >
          <tr >
            <th style="padding: 10px">Danh mục</th>
            <th style="width:25%; padding: 10px">Số lượng</th>
            <th style="width:25%; padding: 10px">Tỉ lệ</th>
          </tr> 
          ${data
            ?.map((item) => {
              return `
              <tr>
                <td style="text-align: center; padding: 10px" >${item.category_name}</td>
                <td style="text-align: center; padding: 10px" >${item.count}</td>
                <td style="text-align: center; padding: 10px" >${((item.count / total) * 100).toFixed(2)} %</td>
              </tr>
              `;
            })
            .join("")}
            <tr>
            <td style="text-align: center; padding: 10px; font-weight: bold" >Tổng số</td>
            <td style="text-align: center; padding: 10px" >${total}</td>
            <td style="text-align: center; padding: 10px" >${100} %</td>
          </tr>
        </table>
          
        </div>
      </body>
    </html>

  `;
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });

    const sharePdf = (url) => {
      shareAsync(url);
    };

    const pdfName = `${file.uri.slice(0, file.uri.lastIndexOf("/") + 1)}THONG_KE_MST_THANG_${month.value}.pdf`;

    await FileSystem.moveAsync({
      from: file.uri,
      to: pdfName,
    });

    sharePdf(pdfName);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Báo cáo</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.monthPicker}
          onPress={() => setIsOpenMonthPicker((prev) => !prev)}
        >
          <Text style={styles.monthTitle}>{month.content}</Text>
          <Entypo name="select-arrows" size={normalize(12)} color="#8c8c8d" />
        </TouchableOpacity>
        {isOpenMonthPicker && (
          <ScrollView style={styles.monthList}>
            {months.map((month) => {
              return (
                <TouchableOpacity
                  key={month?.value}
                  style={styles.monthItem}
                  onPress={() => {
                    setIsOpenMonthPicker(false);
                    setMonth(month);
                  }}
                >
                  <Text style={styles.pickerTitle}>{month.content}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
      {data?.length > 0 && (
        <ScrollView style={{ height: normalize(340) }} nestedScrollEnabled={true}>
          <View style={styles.container}>
            <PieChart
              data={data}
              width={SCREEN_WIDTH}
              height={normalize(140)}
              chartConfig={{
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
              }}
              accessor={"count"}
              backgroundColor={"transparent"}
              center={[50, -10]}
              paddingLeft={-80}
              style={{}}
            />
          </View>

          <Table
            data={[
              [
                {
                  content: "Danh mục",
                  per: 50,
                  styles: { padding: normalize(10), fontFamily: "nunito-bold", fontSize: normalize(10) },
                },
                {
                  content: "Số lượng",
                  per: 20,
                  styles: { padding: normalize(10), fontFamily: "nunito-bold", fontSize: normalize(10) },
                },
                {
                  content: "Tỉ lệ",
                  per: 30,
                  styles: { padding: normalize(10), fontFamily: "nunito-bold", fontSize: normalize(10) },
                },
              ],
              ...generateDataForTable(),
            ]}
          />
        </ScrollView>
      )}

      {data?.length == 0 && <Text style={styles.emptyDataNoti}>Không có dữ liệu cho {noDataMonth}</Text>}

      <View style={styles.footer}>
        <FlatButton
          _styles={styles.submitBtn}
          text="Phân tích"
          fontSize={normalize(10)}
          textColor={"#5b4cfd"}
          onPress={() => {
            handleSubmit();
          }}
        >
          <AntDesign name="linechart" size={normalize(19)} color={"#5b4cfd"} />
        </FlatButton>

        {data?.length > 0 && (
          <FlatButton
            _styles={styles.createPdfBtn}
            text="Xuất PDF"
            fontSize={normalize(10)}
            textColor={"#fff"}
            onPress={() => {
              generatePdf("export");
            }}
          >
            <AntDesign name="export" size={normalize(16)} color={"#fff"} />
          </FlatButton>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: normalize(20),
    position: "relative",
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

  monthPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#8c8c8d",
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(6),
    width: normalize(100),
  },

  monthTitle: {
    fontFamily: "nunito-bold",
    fontSize: normalize(10),
    color: "#3c3c3c",
    marginRight: normalize(6),
  },

  monthList: {
    position: "absolute",
    top: normalize(40),
    right: normalize(0),
    width: normalize(100),
    height: normalize(160),
    zIndex: 100,
    borderWidth: 1,
    borderColor: "#ced0d4",
    backgroundColor: "#fff",
    borderRadius: normalize(6),
  },
  monthItem: {
    paddingVertical: normalize(10),
    borderBottomWidth: 1,
    borderColor: "#ced0d4",
  },
  pickerTitle: {
    fontFamily: "nunito-bold",
    fontSize: normalize(10),
    color: "#3c3c3c",
    textAlign: "center",
  },

  container: {
    marginTop: normalize(20),
    marginBottom: normalize(20),
  },

  emptyDataNoti: {
    fontFamily: "nunito-bold",
    fontSize: normalize(10),
    color: "#3c3c3c",
    textAlign: "center",
  },

  footer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },

  submitBtn: {
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
    marginTop: normalize(10),
  },

  createPdfBtn: {
    width: "90%",
    height: normalize(30),
    paddingVertical: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5b4cfd",
    borderRadius: normalize(1000),
    borderWidth: 1,
    borderColor: "#5b4cfd",
    marginTop: normalize(10),
  },
});

export default StatisticByCategoryScreen;
