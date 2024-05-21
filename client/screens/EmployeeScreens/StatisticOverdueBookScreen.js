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
import DateTimePicker from "@react-native-community/datetimepicker";

import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";

function StatisticOverdueBookScreen() {
  const [statisticData, setStatisticData] = useState();
  const [previewData, setPreviewData] = useState();
  const [legends, setLegends] = useState();
  const [seletedDate, setSeletedDate] = useState(new Date());

  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);

  const [noDataDate, setNoDataDate] = useState();

  const handleSubmit = () => {
    _retrieveData("ACCESS_TOKEN").then((access_token) => {
      const config = {
        headers: { Authorization: `Bearer ${access_token}` },
        params: {
          date: seletedDate.toISOString().split("T")[0],
        },
      };

      axios
        .get(`http://10.0.2.2:5000/borrowed-books/statistic/overdue-books`, config)
        .then((result) => {
          const { overdue_book_detail, overdue_data } = result.data;

          console.log(result.data);

          const _legends = [];

          const data = overdue_book_detail?.map((item) => {
            const color = randomColor({
              luminosity: "bright",
              format: "rgb",
            });
            _legends.push({
              content: item.book_name,
              color,
            });
            return {
              name: item.book_name,
              ...item,
              color,
              legendFontColor: "#505050",
              legendFontSize: normalize(10),
            };
          });
          setLegends(_legends);
          setNoDataDate(seletedDate.toISOString().split("T")[0]);
          setPreviewData(overdue_data);
          setStatisticData(data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const generateDataForTable = () => {
    return previewData?.map((item) => {
      return [
        {
          content: item.book_name,
          per: 50,
          styles: { paddingVertical: normalize(4), fontSize: normalize(8) },
        },
        { content: item.borrow_date, per: 25, styles: { paddingVertical: normalize(4), fontSize: normalize(8) } },
        {
          content: item.overdue_days,
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
    const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <div style="padding: 10px 60px;">
        <h2 style="text-align: center; padding: 0 60px; line-height: 1.2">BÁO CÁO THỐNG KÊ SÁCH TRẢ TRỄ NGÀY ${
          seletedDate.toISOString().split("T")[0]
        }</h2>
        <div style="width:100%; border: 1px solid #ccc; display: flex; align-items: flex-start; justify-content: center; flex-direction: column; width: fit-content; padding: 16px 20px">
        <h3 style="text-align: left; padding: 0 40px; line-height: 1.2; margin: 10px 0">Tổng số sách trả trễ ngày ${
          seletedDate.toISOString().split("T")[0]
        }: ${statisticData.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0)} quyển</h3>  
        ${statisticData
          ?.map((data) => {
            const total = statisticData.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0);

            return `
              <div style="padding: 10px">
                <span>${data.book_name}: </span>
                <span style="font-weight: bold; margin-left: 8px; font-size: 20px">${(
                  (data.count / total) *
                  100
                ).toFixed(2)} %</span>
              </div>
              `;
          })
          .join("")}
        </div>
          
        <h3 style="text-align: left; padding: 0 40px; line-height: 1.2; margin: 10px 0; margin-top: 30px"> Danh sách sách trả trễ </h3> 
          <table style="margin-top: 20px; width: 100%" border >
          <tr >
            <th>Tên sách</th>
            <th style="width:30%">ngày mượn</th>
            <th style="width:15%">số ngày trễ</th>
          </tr> 
          ${previewData
            ?.map((data) => {
              return `
              <tr>
                <td style="text-align: center; padding: 10px" >${data.book_name}</td>
                <td style="text-align: center; padding: 10px" >${data.borrow_date}</td>
                <td style="text-align: center; padding: 10px" >${data.overdue_days}</td>
              </tr>
              `;
            })
            .join("")}
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

    const pdfName = `${file.uri.slice(0, file.uri.lastIndexOf("/") + 1)}THONG_KE_SACH_TRA_TRE_${
      seletedDate.toISOString().split("T")[0]
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
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.monthPicker}
          onPress={() => setIsOpenDatePicker((prev) => !prev)}
        >
          <Text style={styles.monthTitle}>{seletedDate.toISOString().split("T")[0]}</Text>
          <Entypo name="select-arrows" size={normalize(12)} color="#8c8c8d" />
        </TouchableOpacity>

        {isOpenDatePicker && (
          <DateTimePicker
            mode="date"
            display="spinner"
            value={seletedDate}
            onChange={(event, selectedDate) => {
              setIsOpenDatePicker(false);
              setSeletedDate(selectedDate);
            }}
          />
        )}
      </View>
      {statisticData?.length > 0 && (
        <ScrollView style={{ height: normalize(340) }} nestedScrollEnabled={true}>
          <View style={styles.container}>
            {statisticData?.length > 0 && (
              <PieChart
                data={statisticData}
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

          {previewData?.length > 0 && (
            <Table
              scrollHeight={normalize(200)}
              data={[
                [
                  {
                    content: "Tến sách",
                    per: 50,
                    styles: { padding: normalize(10), fontFamily: "nunito-bold", fontSize: normalize(10) },
                  },
                  {
                    content: "Ngày mượn",
                    per: 25,
                    styles: { padding: normalize(10), fontFamily: "nunito-bold", fontSize: normalize(10) },
                  },
                  {
                    content: "Số ngày trễ",
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
      {previewData?.length == 0 && <Text style={styles.emptyDataNoti}>There are no data for {noDataDate}</Text>}

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

        {statisticData?.length > 0 && (
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
    justifyContent: "flex-start",
  },

  submitBtn: {
    width: "90%",
    height: normalize(30),
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

export default StatisticOverdueBookScreen;
