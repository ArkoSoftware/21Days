import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "../../security/firebase";
import Loading from "../../components/Loading";
import { FancyAlert } from "react-native-expo-fancy-alerts";
import { MAIN_COLOR } from "../../color";
// import { signInWithEmailAndPassword } from "firebase/auth";
import { arrayUnion, doc, updateDoc } from "firebase/firestore/lite";
import { AuthContext } from "../../contexts/AuthProvider";
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';

const Login = ({ navigation }) => {
  // GoogleSignin.configure({
  //   webClientId:'696569437747-3hum6ku5kmob5j3d9mdci5s30dkbsb0o.apps.googleusercontent.com'
  // })
  const { signIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [notificationId, setNotificationId] = useState(null);

  

  const SubmitForm = () => {
    setLoading(true);
    setEmailError(false);
    setPasswordError(false);
    if (email.length == 0 || password.length == 0) {
      if (email.length == 0) {
        setEmailError(true);
      }
      if (password.length == 0) {
        setPasswordError(true);
        setLoading(false);
        return;
      }
    } else {
      signIn(email,password)
      .then(async (data) => {
            const doc1 = doc(db, "user", data.user.uid);
            const snap = await updateDoc(doc1, {
              notificationId: arrayUnion(notificationId),
            }); 
            console.log(data)
          })
          .catch((error) => {
            if ((error.code = "auth/wrong-password")) {
              setShowAlert(true);
              setEmail("");
              setPassword("");
            }
          }); 
    }
    setLoading(false);
  };

  const signInWithGoogle = () => {};
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
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setShowAlert(!showAlert)}
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "red",
                    borderRadius: 50,
                    width: "100%",
                  }}
                >
                  <Icon name="close" color={"#fff"} size={30} />
                </TouchableOpacity>
              }
              style={{ backgroundColor: "white" }}
            >
              <Text
                className="font-light text-base"
                style={{ marginTop: -16, marginBottom: 32 }}
              >
                Incorrect Email/ Password
              </Text>
            </FancyAlert>
            <View className="flex flex-row ">
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginOption")}
                activeOpacity={0.7}
              >
                <Icon name="chevron-back" size={30} color />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="my-auto text-center text-3xl text-black font-bold">
                  Login
                </Text>
              </View>
            </View>
            <KeyboardAvoidingView className="flex-1 flex flex-col ">
              <ScrollView
                className="flex-1 flex flex-col space-y-7"
                showsVerticalScrollIndicator={false}
              >
                <View className="flex-1 flex flex-col space-y-5 pt-10">
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
                    <View className=" rounded-xl bg-gray-100 flex flex-row">
                      <TextInput
                        secureTextEntry={showPassword}
                        value={password}
                        onChangeText={(txt) => {
                          setPassword(txt);
                          txt.length > 0 ? setPasswordError(false) : null;
                        }}
                        placeholder="Password"
                        className="flex-1 p-3"
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="my-auto  p-3"
                        activeOpacity={0.9}
                      >
                        {showPassword ? (
                          <Icon
                            name="eye-outline"
                            size={22}
                            color={"#afafaf"}
                          />
                        ) : (
                          <Icon
                            name="eye-off-outline"
                            size={22}
                            color={"#afafaf"}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
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
                  </View>
                  <View className="flex-1">
                    <TouchableOpacity
                      activeOpacity={0.7}
                      className="p-3 rounded-xl ml-auto"
                      onPress={() => navigation.navigate("ResetPassword")}
                    >
                      <Text style={{ color: MAIN_COLOR }}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-1">
                    <TouchableOpacity
                      activeOpacity={0.8}
                      placeholder="Email or Username"
                      className="p-4 rounded-xl "
                      style={{ backgroundColor: MAIN_COLOR }}
                      onPress={() => SubmitForm()}
                    >
                      <Text className="text-white text-center ">Login</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-1">
                    <View className="p-4 rounded-xl flex flex-row mx-auto">
                      <Text className=" text-gray-400">
                        Don't Have An Account?
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        className="mx-2 my-auto"
                        onPress={() => navigation.navigate("CreateAccount")}
                      >
                        <Text style={{ color: MAIN_COLOR }}>Signup</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View className="border border-b-0 border-gray-200 mx-20"></View>
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
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </>
      )}
    </>
  );
};

export default Login;
