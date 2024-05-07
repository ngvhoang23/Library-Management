import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Keyboard, TouchableOpacity, unstable_batchedUpdates } from "react-native";
import { Formik } from "formik";
import FlatButton from "../../shared/FlatButton.js";
import * as yup from "yup";
import axios from "axios";
import LoadingModal from "../../components/LoadingModal.js";
import AlertModal from "../../components/AlertModal.js";
import { _retrieveData, addDays, normalize } from "../../defined_function/index.js";
import { useIsFocused } from "@react-navigation/native";
import PreviewInfoItem from "../../components/PreviewInfoItem.js";
import PickerModal from "../../components/PickerModal.js";
import BriefBorrowingInfoPreview from "../../components/BriefBorrowingInfoPreview.js";
import { FontAwesome } from "@expo/vector-icons";

import socket from "../../socket.js";

const formSchema = yup.object({});

function AddBorrowBookScreen({ route, navigation }) {
  const { reader_info, book_info } = route.params;
  const { user_id: reader_id, reader_type, full_name, phone_num, user_avatar } = reader_info;
  const { book_id } = book_info;

  const [userInfo, setUserInfo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState({ isSuccess: false, visible: false });
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(book_info);
  const [selectedReader, setSelectedReader] = useState(reader_info);
  const [selectedId, setSelectedId] = useState();
  const [searchResult, setSearchResult] = useState();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      _retrieveData("USER_INFO")
        .then((user_info) => {
          setUserInfo(JSON.parse(user_info));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const config = {
            headers: { Authorization: `Bearer ${access_token}` },
          };
          axios
            .get(`http://10.0.2.2:5000/books/book-groups`, config)
            .then((result) => {
              setBooks([...result.data]);
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
    if (selectedId) {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const config = {
            params: {
              book_detail_id: selectedId,
            },
            headers: { Authorization: `Bearer ${access_token}` },
          };
          axios
            .get(`http://10.0.2.2:5000/books/book-groups/${selectedId}`, config)
            .then((result) => {
              setSelectedBook(result.data[0]);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedId]);

  const handleSubmit = ({ borrow_date, return_date }) => {
    setIsLoading(true);

    const data = {
      emp_id: userInfo?.user_id,
      reader_id: reader_id,
      book_id: book_id,
      borrow_date: borrow_date,
      return_date: return_date,
    };

    _retrieveData("ACCESS_TOKEN")
      .then((access_token) => {
        const configurations = {
          method: "POST",
          url: `http://10.0.2.2:5000/borrowed-books/`,
          data: data,
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
        axios(configurations)
          .then((result) => {
            setResultStatus({ isSuccess: 1, visible: true });
            socket?.emit("borrow-book", data);
            navigation.goBack();
          })
          .catch((err) => {
            if (err?.response?.data?.code === "UNAVAILABLE_BOOK") {
              alert("This book is unavailable");
            } else if (err?.response?.data?.code == "INVALID_READER") {
              alert("Reader is not eligible to borrow");
            }
            setResultStatus({ isSuccess: 0, visible: true });
            console.log("err", err);
          })
          .finally((result) => {
            setIsLoading(false);
          });
      })
      .catch((err) => {
        setIsLoading(false);
        setResultStatus({ isSuccess: 0, visible: true });
        console.log(err);
      });
  };

  return (
    <View style={styles.wrapper}>
      <Formik
        initialValues={{
          borrow_date: new Date().toISOString().split("T")[0],
          return_date: addDays(new Date(), 7).toISOString().split("T")[0],
        }}
        validationSchema={formSchema}
        onSubmit={(values, actions) => {
          actions.resetForm();
          handleSubmit(values);
        }}
      >
        {(props) => (
          <TouchableOpacity style={styles.formWrapper} activeOpacity={1.0} onPress={Keyboard.dismiss}>
            <ScrollView
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}
            >
              <BriefBorrowingInfoPreview
                _styles={styles.borrowingInfo}
                book_name={selectedBook?.book_name}
                position={selectedBook?.position}
                cover_photo={`http://10.0.2.2:5000${selectedBook?.cover_photo}`}
                reader_name={full_name}
                phone_num={phone_num}
                user_avatar={`http://10.0.2.2:5000${user_avatar}`}
              />
              <PreviewInfoItem
                _styles={[styles.input]}
                textStyles={{ color: "#676768" }}
                lableTitle="Ngày mượn"
                value={props.values.borrow_date}
                icon={<FontAwesome name="hourglass-1" size={normalize(15)} color="#3c3c3c" />}
                read_only
                border
              />

              <PreviewInfoItem
                _styles={[styles.input]}
                textStyles={{ color: "#676768" }}
                lableTitle="Ngày trả"
                value={props.values.return_date}
                icon={<FontAwesome name="hourglass-end" size={normalize(15)} color="#3c3c3c" />}
                read_only
                border
              />
            </ScrollView>
            <FlatButton
              _styles={styles.submitBtn}
              onPress={props.handleSubmit}
              text="Mượn sách"
              fontSize={normalize(10)}
            />
          </TouchableOpacity>
        )}
      </Formik>
      <LoadingModal visible={isLoading} />
      <AlertModal
        onClose={() => setResultStatus({ isSuccess: 0, visible: false })}
        isSuccess={resultStatus?.isSuccess}
        visible={resultStatus?.visible ? true : false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },

  borrowingInfo: {
    marginBottom: normalize(20),
  },

  formWrapper: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },

  formContainer: {
    width: "100%",
    flex: 1,
  },

  input: {
    width: "94%",
    padding: normalize(10),
    marginBottom: normalize(8),
  },

  submitBtn: {
    width: "80%",
    height: normalize(32),
    marginBottom: normalize(16),
    paddingVertical: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c60ff",
    borderRadius: normalize(100),
  },
});

export default AddBorrowBookScreen;