import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  titleText: {
    fontFamily: "nunito-regular",
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  paragraph: {
    fontFamily: "nunito-regular",
    marginVertical: 8,
    lineHeight: 20,
  },
  container: {
    fontFamily: "nunito-regular",
    flex: 1,
    padding: 20,
  },
  input: {
    fontFamily: "nunito-regular",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
  },
  errorText: {
    fontFamily: "nunito-regular",
    color: "crimson",
    textAlign: "left",
  },
});
