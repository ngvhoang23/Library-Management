import React from "react";
import { StyleSheet, Button, TextInput, View, Text } from "react-native";
import { globalStyles } from "../styles/global.js";
import { Formik } from "formik";
import FlatButton from "../shared/FlatButton.js";
import * as yup from "yup";

const loginSchema = yup.object({
  user_name: yup.string().required(),
  password: yup.string().required(),
});

function LoginForm({ onSubmit }) {
  return (
    <View>
      <Formik
        initialValues={{ user_name: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={(values, actions) => {
          actions.resetForm();
          onSubmit(values);
        }}
      >
        {(props) => (
          <View>
            <TextInput
              style={[globalStyles.input, styles.input]}
              placeholder="User Name"
              onChangeText={props.handleChange("user_name")}
              value={props.values.user_name}
            />
            {props.touched.user_name && props.errors.user_name && (
              <Text style={[globalStyles.errorText, styles.errorText]}>{props.errors.user_name}</Text>
            )}

            <TextInput
              style={[globalStyles.input, styles.input]}
              multiline
              placeholder="Password"
              onChangeText={props.handleChange("password")}
              value={props.values.password}
            />
            {props.touched.password && props.errors.password && (
              <Text style={[globalStyles.errorText, styles.errorText]}>{props.errors.password}</Text>
            )}

            <FlatButton addingStyle={styles.submitBtn} onPress={props.handleSubmit} text="submit" />
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  submitBtn: {
    marginTop: 16,
  },
  input: {
    marginTop: 14,
  },
  errorText: {
    marginBottom: 4,
  },
});

export default LoginForm;
