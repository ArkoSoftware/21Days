import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { auth } from "../../security/firebase";
import Loading from "../../components/Loading";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { FancyAlert } from "react-native-expo-fancy-alerts";
import { MAIN_COLOR } from "../../color";

const CreateAccount = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordLimitError, setPasswordLimitError] = useState(false);

  const SubmitForm = async () => {
    setLoading(true);
    setNameError(false);
    setEmailError(false);
    setPasswordError(false);
    setPasswordLimitError(false);

    if (
      name.length == 0 ||
      email.length == 0 ||
      password.length == 0 ||
      password.length < 9
    ) {
      if (name.length == 0) {
        setNameError(true);
      }
      if (email.length == 0) {
        setEmailError(true);
      }
      if (password.length == 0) {
        setPasswordError(true);
        setLoading(false);
        return;
      }
      if (password.length < 8) {
        setPasswordLimitError(true);
      }
    } else {
      await createUserWithEmailAndPassword(auth, email, password).then(
        async (user) => {
          await sendEmailVerification(user.user);
          await updateProfile(user.user, { displayName: name });
          setShowAlert(true);
        }
      );
    }
    setLoading(false);
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <SafeAreaView className="p-4 py-8 px-6 flex-1 flex flex-col bg-white">
            <FancyAlert
              visible={showAlert}
              onRequestClose={() => setShowAlert(!showAlert)}
              icon={
                <View
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
                </View>
              }
              style={{ backgroundColor: "white" }}
            >
              <Text
                className="font-light text-base"
                style={{ marginTop: -16, marginBottom: 32 }}
              >
                Check Your Email For Verification
              </Text>
            </FancyAlert>
            <View className="flex flex-row">
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginOption")}
                activeOpacity={0.7}
              >
                <Icon name="chevron-back" size={30} color />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="my-auto text-center text-3xl text-black font-bold">
                  Sign Up
                </Text>
              </View>
            </View>
            <KeyboardAvoidingView className="flex-1 flex flex-col ">
              <ScrollView
                className="flex-1 flex flex-col space-y-7"
                showsVerticalScrollIndicator={false}
              >
                <View className="flex-grow flex flex-col pt-10 space-y-6">
                  <View className=" flex flex-col">
                    <TextInput
                      value={name}
                      onChangeText={(txt) => {
                        setName(txt);
                        txt.length > 0 ? setNameError(false) : null;
                      }}
                      placeholder="Full Name"
                      className="p-3 rounded-xl bg-gray-100"
                      style={{ backgroundColor: "#f7f7f7" }}
                    />
                    {nameError ? (
                      <View className="flex-row pt-3 pr-3">
                        <Icon
                          name="alert-circle-outline"
                          color={"#D32F2F"}
                          size={24}
                        />
                        <Text className="text-sm my-auto ml-2 text-red-700">
                          Name is invalid or empty
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>
                  <View className="flex flex-col">
                    <TextInput
                      value={email}
                      onChangeText={(txt) => {
                        setEmail(txt);
                        txt.length > 0 ? setEmailError(false) : null;
                      }}
                      placeholder="Email"
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
                  <View className="flex flex-col">
                    <TextInput
                      secureTextEntry
                      value={password}
                      onChangeText={(txt) => {
                        setPassword(txt);
                        txt.length > 0 ? setPasswordError(false) : null;
                      }}
                      placeholder="Password"
                      className="p-3 rounded-xl bg-gray-100"
                    />
                    {passwordError ? (
                      <View className="flex-row pt-3 pr-3">
                        <Icon
                          name="alert-circle-outline"
                          color={"#D32F2F"}
                          size={24}
                        />
                        <Text className="text-sm my-auto ml-2 text-red-700">
                          Password is invalid or empty
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )}
                    {passwordLimitError ? (
                      <View className="flex-row pt-3 pr-3">
                        <Icon
                          name="alert-circle-outline"
                          color={"#D32F2F"}
                          size={24}
                        />
                        <Text className="text-sm my-auto ml-2 text-red-700">
                          Password must be more than 8 characters
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>

                  <View className="flex-1 mt-10">
                    <TouchableOpacity
                      activeOpacity={0.8}
                      placeholder="Email or Username"
                      className="p-4 rounded-xl "
                      style={{ backgroundColor: MAIN_COLOR }}
                      onPress={() => SubmitForm()}
                    >
                      <Text className="text-white text-center ">
                        Create Account
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-1">
                    <View className="p-4 rounded-xl flex flex-row mx-auto">
                      <Text className=" text-gray-400">
                        Already Have An Account?
                      </Text>
                      <TouchableOpacity
                        className="mx-2 my-auto"
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate("Login")}
                      >
                        <Text style={{ color: "#40B381" }}>Sign In</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View className="flex-1 flex flex-col">
                  <TouchableOpacity
                    onPress={() => signInWithGoogle()}
                    className="flex-row px-10 my-1 py-3 border border-gray-200 rounded-xl mt-0"
                  >
                    <Icon
                      name="logo-google"
                      size={20}
                      color={"#D15000"}
                      style={{ marginTop: "auto", marginBottom: "auto" }}
                    />
                    <Text className="my-auto mx-auto text-base">
                      Sign in with Google
                    </Text>
                  </TouchableOpacity>
                  <View className="flex-row px-10 my-1 py-3 border border-gray-200 rounded-xl mt-4">
                    <Icon
                      name="logo-facebook"
                      size={20}
                      color={"#4064AC"}
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        borderRadius: 100,
                      }}
                    />
                    <Text className="my-auto mx-auto text-base">
                      Sign in with Facebook
                    </Text>
                  </View>
                </View>
                <View className="flex-1 flex flex-col"></View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </>
      )}
    </>
  );
};

export default CreateAccount;
