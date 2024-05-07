import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { normalize } from "../defined_function";
import { useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

function CountDown({ _styles, initValue, title, onTimeOut }) {
  const refInterval = useRef();

  const [timeOut, setTimeOut] = useState(initValue || 0);
  const isFocused = useIsFocused();

  useEffect(() => {
    refInterval.current = setInterval(() => {
      setTimeOut((prev) => {
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(refInterval?.current);
  }, []);

  useEffect(() => {
    if (!isFocused) {
      setTimeOut(0);
      clearInterval(refInterval?.current);
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      if (timeOut <= 0) {
        onTimeOut();
        clearInterval(refInterval?.current);
      }
    }
  }, [timeOut, isFocused]);

  return (
    <View style={[styles.wrapper, _styles]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.clockWrapper}>
        <ActivityIndicator size={normalize(32)} color={"#6c60ff"} />
        <View style={styles.countNumWrapper}>
          <Text style={styles.countNum}>{timeOut}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "nunito-bold",
    fontSize: normalize(12),
    color: "#6c60ff",
  },
  clockWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: normalize(50),
    height: normalize(50),
  },
  countNumWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  countNum: {
    fontFamily: "nunito-bold",
    fontSize: normalize(10),
    color: "#676768",
  },
});

export default CountDown;
