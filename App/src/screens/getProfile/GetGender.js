import { View, Text, Touchable, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Male from "../../../assets/image/male.jpg";
import Female from "../../../assets/image/female.jpg";
import Neutral from "../../../assets/image/neutral.jpg";
import { auth, db } from "../../security/firebase";
import { doc, setDoc } from "firebase/firestore/lite";
import Loading from "../../components/Loading";
import { MAIN_COLOR } from "../../color";
const genderName = ["Male", "Female", "Other"];
const GetGender = ({ refresh }) => {
  const [loading, setLoading] = useState(false);
  const SubmitForm = async () => {
    if (gender != 3) {
      setLoading(true);
      const ref = doc(db, "user", auth.currentUser.uid);
      const snap = await setDoc(
        ref,
        { gender: genderName[gender] },
        { merge: true }
      );
      refresh();
    }
  };
  const [gender, setGender] = useState(3);
  if (loading) {
    return <Loading />;
  } else {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="text-center m-16 font-extrabold text-5xl text-gray-700">
          Select your Gender
        </Text>
        <View className="flex flex-row justify-evenly mt-auto mb-auto px-5">
          {gender == 0 ? (
            <TouchableOpacity
              activeOpacity={0.8}
              className="p-3 flex-1 border border-blue-700 rounded-2xl mx-2"
            >
              <Image source={Male} className="w-16 h-16 my-auto mx-auto" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setGender(0)}
              activeOpacity={0.8}
              className="p-3 flex-1 border border-gray-200 rounded-2xl mx-2"
            >
              <Image source={Male} className="w-16 h-16 my-auto mx-auto" />
            </TouchableOpacity>
          )}
          {gender == 1 ? (
            <TouchableOpacity
              activeOpacity={0.8}
              className="p-3 flex-1 border border-blue-700 rounded-2xl mx-2"
            >
              <Image source={Female} className="w-20 h-20 my-auto mx-auto" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setGender(1)}
              activeOpacity={0.8}
              className="p-3 flex-1 border border-gray-200 rounded-2xl mx-2"
            >
              <Image source={Female} className="w-20 h-20 my-auto mx-auto" />
            </TouchableOpacity>
          )}
          {gender == 2 ? (
            <TouchableOpacity
              activeOpacity={0.8}
              className="p-3 flex-1 border border-blue-700 rounded-2xl mx-2"
            >
              <Image source={Neutral} className="w-16 h-16 my-auto mx-auto" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setGender(2)}
              activeOpacity={0.8}
              className="p-3 flex-1 border border-gray-200 rounded-2xl mx-2"
            >
              <Image source={Neutral} className="w-16 h-16 my-auto mx-auto" />
            </TouchableOpacity>
          )}
        </View>
        <View>
          <TouchableOpacity
            style={{ backgroundColor: MAIN_COLOR }}
            activeOpacity={0.9}
            onPress={() => SubmitForm()}
            className="p-5 rounded-xl m-8"
          >
            <Text
              className="text-center tracking-widest text-white my-auto "
              style={{ fontSize: 14 }}
            >
              CONTINUE
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
};

export default GetGender;
