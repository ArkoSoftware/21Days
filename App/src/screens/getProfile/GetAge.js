import { View, Text, Touchable, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Male from "../../../assets/image/male.jpg";
import Female from "../../../assets/image/female.jpg";
import Neutral from "../../../assets/image/neutral.jpg";
import { auth, db } from "../../security/firebase";
import { doc, setDoc } from "firebase/firestore/lite";
import Loading from "../../components/Loading";
import DatePicker from "../../components/DatePicker";
import { MAIN_COLOR } from "../../color";
const genderName = ["Male", "Female", "Other"];
const GetAge = ({ refresh }) => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState(false);
  const SubmitForm = async () => {
    const date1 = new Date(date).getTime();
    const date2 = new Date().getTime();
    const diff = (date2 - date1) / 1000 / 86400 / 365;
    if (parseInt(diff) >= 18) {
      setLoading(true);
      const ref = doc(db, "user", auth.currentUser.uid);
      const snap = await setDoc(ref, { dob: date }, { merge: true });
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
          Select your Date of Birth
        </Text>
        <View className="flex flex-col justify-evenly mt-auto mb-auto px-5 w-full">
          <DatePicker
            min={false}
            max={true}
            label={"Select Date of Birth"}
            setState={setDate}
            date={date}
          />
          {error && (
            <Text className="text-red-500">* You need to be 18 or older</Text>
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

export default GetAge;
