import { ActivityIndicator, Button, Modal, StyleSheet, Text, View } from "react-native";
import { normalize } from "../defined_function";

function LoadingModal({ visible }) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} statusBarTranslucent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator size="large" color={"#1e74fd"} />
          <Text style={styles.modalText}>Loading...</Text>
        </View>
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
    margin: normalize(20),
    width: normalize(150),
    height: normalize(50),
    backgroundColor: "white",
    borderRadius: normalize(5),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalText: {
    marginVertical: normalize(15),
    textAlign: "center",
    fontSize: normalize(14),
    marginLeft: normalize(15),
    fontFamily: "nunito-medium",
    letterSpacing: normalize(4),
  },
});

export default LoadingModal;
