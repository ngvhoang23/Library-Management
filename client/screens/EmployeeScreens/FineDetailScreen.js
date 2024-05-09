import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import FlatButton from "../../shared/FlatButton";
import LoadingModal from "../../components/LoadingModal";
import PreviewInfoItem from "../../components/PreviewInfoItem";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMoneyBill1, faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import AlertModal from "../../components/AlertModal";
import { useIsFocused } from "@react-navigation/native";
import { _retrieveData, normalize } from "../../defined_function";
import BriefUserInfoPreview from "../../components/BriefUserInfoPreview";
import PayDeptModal from "../../components/PayDeptModal";
import RoundUserInfoPreview from "../../components/RoundUserInfoPreview";
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
import axios from "axios";

function FineDetailScreen({ route, navigation }) {
  const { reader_id } = route.params;

  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });
  const [isShowPayDeptModal, setIsShowPayDeptModal] = useState(false);
  const [fineData, setFineData] = useState();

  useEffect(() => {
    if (isFocused) {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const config = {
            headers: { Authorization: `Bearer ${access_token}` },
            params: { reader_id },
          };
          axios
            .get(`http://10.0.2.2:5000/borrowed-books/fine/${reader_id}`, config)
            .then((result) => {
              setFineData(result.data);
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
    if (!isShowPayDeptModal) {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const config = {
            headers: { Authorization: `Bearer ${access_token}` },
            params: { reader_id },
          };
          axios
            .get(`http://10.0.2.2:5000/borrowed-books/fine/${reader_id}`, config)
            .then((result) => {
              setFineData(result.data);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isShowPayDeptModal]);

  const {
    borrowed_books = [],
    reader_info = {},
    total_amount_collected = 0,
    total_fine = 0,
  } = fineData ? fineData : {};
  const { reader_name, reader_avatar, reader_phone_num } = reader_info;

  return (
    <ImageBackground source={require("../../assets/images/page_bg2.jpg")} style={styles.wrapper}>
      <View style={styles.container}>
        <RoundUserInfoPreview
          _styles={styles.userInfoContainer}
          reader_name={reader_name}
          phone_num={reader_phone_num}
          user_avatar={`http://10.0.2.2:5000${reader_avatar}`}
          borderColor={"#f02849"}
        />
        <PreviewInfoItem
          _styles={[styles.infoPreview]}
          textStyles={{ color: "#f02849" }}
          lableTitle="Tổng tiền phạt"
          value={`${total_fine} VNĐ`}
          icon={<MaterialIcons name="attach-money" size={normalize(16)} color="#f02849" />}
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.infoPreview]}
          textStyles={{ color: "#6ec531" }}
          lableTitle="Đã thu"
          value={`${total_amount_collected || 0} VNĐ`}
          icon={<MaterialIcons name="attach-money" size={normalize(16)} color="#6ec531" />}
          read_only
        />

        <PreviewInfoItem
          _styles={[styles.infoPreview]}
          textStyles={{ color: "#f02849" }}
          lableTitle="Còn lại"
          value={`${total_fine - total_amount_collected || 0} VNĐ`}
          icon={<MaterialIcons name="attach-money" size={normalize(16)} color="#f02849" />}
          read_only
        />
      </View>

      <View style={styles.options}>
        <FlatButton
          _styles={styles.seeDetailBtn}
          text="Xem chi tiết"
          textColor={"#5b4cfd"}
          onPress={() =>
            navigation.navigate("Overdue Books Detail", {
              overdue_books: borrowed_books,
            })
          }
        />
        <FlatButton _styles={styles.payFineBtn} text="Thanh toán tiền phạt" onPress={() => setIsShowPayDeptModal(true)}>
          <MaterialIcons name="attach-money" size={normalize(15)} color="#fff" />
        </FlatButton>
      </View>
      <LoadingModal visible={isLoading} />
      <AlertModal
        onClose={() => setResultStatus({ isSuccess: 0, visible: false })}
        isSuccess={resultStatus?.isSuccess}
        visible={resultStatus?.visible ? true : false}
      />
      <PayDeptModal
        total_dept={total_fine - total_amount_collected}
        reader_id={reader_id}
        visible={isShowPayDeptModal}
        setVisible={setIsShowPayDeptModal}
      ></PayDeptModal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 0,
  },

  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: normalize(20),
  },

  userInfoContainer: {
    width: "100%",
    marginBottom: normalize(30),
  },

  infoPreview: {
    marginBottom: normalize(20),
    width: "100%",
  },

  payFineBtn: {
    height: normalize(32),
    flex: 1,
    paddingVertical: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c60ff",
    marginLeft: normalize(10),
    borderRadius: normalize(100),
  },

  seeDetailBtn: {
    height: normalize(32),
    flex: 1,
    paddingVertical: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e1e0ed",
    marginRight: normalize(10),
    borderRadius: normalize(100),
  },

  totalFine: {
    marginBottom: normalize(10),
  },

  options: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: normalize(10),
    paddingHorizontal: normalize(20),
  },
});

export default FineDetailScreen;