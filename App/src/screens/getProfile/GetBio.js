import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Male from "../../../assets/image/male.jpg";
import Female from "../../../assets/image/female.jpg";
import Neutral from "../../../assets/image/neutral.jpg";
import { auth, db } from "../../security/firebase";
import { doc, setDoc } from "firebase/firestore/lite";
import Loading from "../../components/Loading";
import DatePicker from "../../components/DatePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MAIN_COLOR } from "../../color";
const genderName = ["Male", "Female", "Other"];
const GetBio = ({ refresh }) => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [error, setError] = useState(false);
  const SubmitForm = async () => {
    if (bio.length >= 20) {
      setLoading(true);
      const ref = doc(db, "user", auth.currentUser.uid);
      const snap = await setDoc(ref, { bio: bio }, { merge: true });
      AsyncStorage.setItem("bio", bio);
      refresh();
    } else {
      setError(true);
    }
  };
  if (loading) {
    return <Loading />;
  } else {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="text-center m-16 font-extrabold text-5xl text-gray-700">
          Say Something About You
        </Text>
        <View className="flex flex-col justify-evenly mt-auto mb-auto px-5 w-full">
          <View className="flex flex-col">
            <Text
              className="font-bold m-1 mx-3 tracking-tighter text-gray-600"
              style={{ fontSize: 18 }}
            >
              Add A Bio
            </Text>
            <TextInput
              numberOfLines={4}
              textAlignVertical={"top"}
              onChangeText={(txt) => setBio(txt)}
              placeholder={"Tell something about yourself"}
              style={{ fontSize: 14 }}
              className="p-4 border border-gray-300 rounded-lg mx-1"
            />
          </View>
          {error && (
            <Text className="text-red-500">* Must be 20 letters or more</Text>
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

export default GetBio;
