import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, getDoc } from "firebase/firestore/lite";
import { auth, db } from "../../security/firebase";

const Notification = ({ navigation }) => {
  const [data, setData] = useState([]);
  const getAllData = async () => {
    const ref1 = doc(db, "user", auth.currentUser.uid);
    const snap = await getDoc(ref1);
    const arr = [];
    for (var i = 0; i < snap.data()["friendRequests"].length; i++) {
      const ref2 = doc(db, "user", snap.data()["friendRequests"][i]);
      const snap2 = await getDoc(ref2);
      arr.push([snap.data()["friendRequests"][i], snap2.data()]);
    }
    setData(arr);
  };
  useEffect(() => {
    getAllData();
  }, []);
  return (
    <SafeAreaView className="p-4 flex-1 bg-white">
      <View className="flex flex-row">
        <Icon name="chevron-back" size={28} color={"#000"} />
        <Text className="my-auto text-xl tracking-tighter ml-4 font-medium">
          Notification
        </Text>
      </View>
      <View className="flex flex-col mt-10">
        {data.map((docs) => {
          const id = docs[0];
          const d1 = docs[1];
          console.log(d1);
          return (
            <View className="bg-gray-100  mx-2 p-4 rounded-xl flex flex-row">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("VisitProfile", { data: id })
                }
              >
                <Image
                  source={{ uri: d1["image"] }}
                  className="h-12 w-12 rounded-full"
                />
              </TouchableOpacity>
              <View className="pl-4 flex flex-row">
                <Text className="my-auto font-bold">{d1["name"]}</Text>
                <Text className="my-auto "> wants to be friends.</Text>
              </View>
              <View className="ml-auto">
                <TouchableOpacity className="bg-blue-600 rounded p-2 my-auto ml-auto">
                  <Text className="text-white">Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default Notification;
