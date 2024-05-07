import { ActivityIndicator, Button, Modal, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { normalize } from "../defined_function";

function AlertModal({ visible, isSuccess, onClose, text }) {
  const timeoutRef = useRef();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      onClose();
    }, 1000);
    return () => {
      clearTimeout(timeoutRef?.current);
    };
  }, [visible]);

  return (
    <Modal animationType="fade" transparent={true} visible={visible} statusBarTranslucent={true}>
      <View style={styles.centeredView}>
        {isSuccess ? (
          <View style={styles.modalView}>
            <View style={styles.successIconWrapper}>
              <AntDesign name="checkcircle" size={normalize(20)} color="#6ec531" />
            </View>
            <Text style={styles.modalText}>{text || "Success"}</Text>
          </View>
        ) : (
          <View style={styles.modalView}>
            <View style={styles.errIconWrapper}>
              <AntDesign name="closecircle" size={normalize(20)} color="#f03958" />
            </View>

            <Text style={styles.modalText}>{text || "Failed"}</Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0008",
  },

  modalView: {
    marginHorizontal: normalize(40),
    paddingRight: normalize(20),
    backgroundColor: "white",
    borderRadius: normalize(5),
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minHeight: normalize(50),
  },

  errIconWrapper: {
    backgroundColor: "rgba(240, 40, 73, 0.2)",
    width: normalize(60),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopStartRadius: normalize(5),
    borderBottomStartRadius: normalize(5),
    height: "100%",
  },

  successIconWrapper: {
    backgroundColor: "rgba(110, 197, 49, 0.2)",
    width: normalize(50),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopStartRadius: normalize(5),
    borderBottomStartRadius: normalize(5),
    height: "100%",
  },

  modalText: {
    marginVertical: normalize(15),
    textAlign: "center",
    fontSize: normalize(14),
    marginLeft: normalize(15),
    fontFamily: "nunito-medium",
    letterSpacing: normalize(2),
  },
});

export default AlertModal;
