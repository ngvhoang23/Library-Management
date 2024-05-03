import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions, PixelRatio } from "react-native";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

const _retrieveData = (key) => AsyncStorage.getItem(key);

const _storeData = (key, value) => AsyncStorage.setItem(key, value);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

function normalize(size) {
  const newSize = size * scale;
  const value = Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  return value * 1.1;
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export { validateEmail, _retrieveData, _storeData, normalize, SCREEN_WIDTH, SCREEN_HEIGHT, addDays };
