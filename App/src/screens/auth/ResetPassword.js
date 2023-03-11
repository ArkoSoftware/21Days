import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { TextInput } from "react-native-gesture-handler";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../security/firebase";
import Loading from "../../components/Loading";
import { FancyAlert } from "react-native-expo-fancy-alerts";
import { MAIN_COLOR } from "../../color";

const ResetPassword = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const SubmitForm = async () => {
    setLoading(true);
    setEmailError(false);
    if (email.length == 0) {
      if (email.length == 0) {
        setEmailError(true);
      }
    } else {
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
      setShowAlert(true);
    }
    setLoading(false);
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <SafeAreaView className="p-4 py-8 px-6 flex-1 flex flex-col bg-white">
          <FancyAlert
            visible={showAlert}
            onRequestClose={() => navigation.navigate("Login")}
            icon={
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate("Login")}
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "green",
                  borderRadius: 50,
                  width: "100%",
                }}
              >
                <Icon name="checkmark-outline" color={"#fff"} size={30} />
              </TouchableOpacity>
            }
            style={{ backgroundColor: "white" }}
          >
            <Text
              className="font-light text-base"
              style={{ marginTop: -16, marginBottom: 32 }}
            >
              Check Your Email For Password Reset
            </Text>
          </FancyAlert>
          <View className="flex flex-row">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="chevron-back" size={30} color />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="my-auto text-center text-3xl text-black font-bold">
                Reset Password
              </Text>
            </View>
          </View>
          <View className=" flex flex-col">
            <View className="flex flex-col pt-10 space-y-7">
              <View className="flex flex-col">
                <TextInput
                  value={email}
                  onChangeText={(txt) => {
                    setEmail(txt);
                    txt.length > 0 ? setEmailError(false) : null;
                  }}
                  placeholder="Email Address"
                  className="p-3 rounded-xl bg-gray-100"
                  style={{ backgroundColor: "#f7f7f7" }}
                />
                {emailError ? (
                  <View className="flex-row pt-3 pr-3">
                    <Icon
                      name="alert-circle-outline"
                      color={"#D32F2F"}
                      size={24}
                    />
                    <Text className="text-sm my-auto ml-2 text-red-700">
                      Email is invalid or empty
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
              </View>

              <View className="">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => SubmitForm()}
                  placeholder="Email or Username"
                  className="p-4 rounded-xl "
                  style={{ backgroundColor: MAIN_COLOR }}
                >
                  <Text className="text-white text-center ">
                    Send Reset Link
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default ResetPassword;
