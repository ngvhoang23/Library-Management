import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
import DateTimePicker from "@react-native-community/datetimepicker";

import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";

function StatisticBookStatusScreen() {
  const [data, setData] = useState();
  const [legends, setLegends] = useState();

  const handleSubmit = () => {
    _retrieveData("ACCESS_TOKEN").then((access_token) => {
      const config = {
        headers: { Authorization: `Bearer ${access_token}` },
      };

      axios
        .get(`http://10.0.2.2:5000/borrowed-books/statistic/book-status`, config)
        .then((result) => {
          const _legends = [];
          const _data = result.data?.map((item) => {
            const color = randomColor({
              luminosity: "bright",
              format: "rgb",
            });
            _legends.push({
              content: item.status ? "Available" : "Unavailable",
              color,
            });
            return {
              name: item.status ? "Available" : "Unavailable",
              ...item,
              color,
              legendFontColor: "#505050",
              legendFontSize: normalize(10),
            };
          });
          setLegends(_legends);
          setData(_data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const generateDataForTable = () => {
    const total = data.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0);

    return data?.map((item) => {
      return [
        {
          content: item.status ? "Có sẵn" : "Đang được mượn",
          per: 50,
          styles: { paddingVertical: normalize(4), fontSize: normalize(8) },
        },
        { content: item.count, per: 25, styles: { paddingVertical: normalize(4), fontSize: normalize(8) } },
        {
          content: ((item.count / total) * 100).toFixed(2) + " %",

          per: 25,
          styles: { paddingVertical: normalize(4), fontSize: normalize(8) },
        },
      ];
    });
  };

  const renderLegends = () => {
    return legends?.map((legend) => {
      return (
        <View style={styles.legendItem} key={legend?.color}>
          <View
            style={{
              borderRadius: normalize(1000),
              width: normalize(16),
              height: normalize(16),
              backgroundColor: legend?.color,
            }}
          ></View>
          <Text style={styles.legendContent} numberOfLines={2}>
            {legend.content}
          </Text>
        </View>
      );
    });
  };

  let generatePdf = async () => {
    const total = data.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0);

    const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <div style="padding: 10px 60px;">
        <h2 style="text-align: center; padding: 0 60px; line-height: 1.2">BÁO CÁO THỐNG KÊ TÌNH TRẠNG SÁCH NGÀY ${
          new Date().toISOString().split("T")[0]
        }</h2>
          
          <table style="margin-top: 20px; width: 100%" border >
          <tr >
            <th style="padding: 10px">Tình trạng</th>
            <th style="width:25%; padding: 10px">Số lượng</th>
            <th style="width:25%; padding: 10px">Tỉ lệ</th>
          </tr> 
          ${data
            ?.map((item) => {
              return `
              <tr>
                <td style="text-align: center; padding: 10px" >${item.status ? "Available" : "Unavailable"}</td>
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

    const pdfName = `${file.uri.slice(0, file.uri.lastIndexOf("/") + 1)}THONG_KE_TINH_TRANG_SACH_${
      new Date().toISOString().split("T")[0]
    }.pdf`;

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
      </View>
      {data?.length > 0 && (
        <ScrollView style={{ height: normalize(340) }} nestedScrollEnabled={true}>
          <View style={styles.container}>
            {data?.length > 0 && (
              <PieChart
                data={data}
                width={normalize(160)}
                height={normalize(160)}
                chartConfig={{
                  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                }}
                accessor={"count"}
                backgroundColor={"transparent"}
                center={[80, 0]}
                paddingLeft={0}
                style={{}}
                hasLegend={false}
              />
            )}
          </View>

          <View style={styles.legendContainer}>{renderLegends()}</View>

          {data?.length > 0 && (
            <Table
              scrollHeight={normalize(200)}
              data={[
                [
                  {
                    content: "Trạng thái",
                    per: 50,
                    styles: { padding: normalize(10), fontFamily: "nunito-bold", fontSize: normalize(10) },
                  },
                  {
                    content: "Số lượng",
                    per: 25,
                    styles: { padding: normalize(10), fontFamily: "nunito-bold", fontSize: normalize(10) },
                  },
                  {
                    content: "Tỉ lệ",
                    per: 25,
                    styles: { padding: normalize(10), fontFamily: "nunito-bold", fontSize: normalize(10) },
                  },
                ],
                ...generateDataForTable(),
              ]}
            />
          )}
        </ScrollView>
      )}
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
    marginBottom: normalize(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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

  legendContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: normalize(10),
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: normalize(10),
  },
  legendContent: {
    fontFamily: "nunito-bold",
    fontSize: normalize(8),
    color: "#505050",
    marginLeft: normalize(10),
    width: "70%",
  },
});

export default StatisticBookStatusScreen;
