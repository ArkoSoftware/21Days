import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore/lite";
import { db, auth } from "../../security/firebase";
const SearchProfile = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const searchProfile = async (txt) => {
    const ref = collection(db, "user");
    const q = query(ref, orderBy("name"));
    const q2 = query(q, startAt(txt));
    const q3 = query(q2, endAt(txt + "\uf8ff"));
    const snap = await getDocs(q3);
    const arr = [];
    snap.forEach((doc) => {
      if (doc.data()["email"] != auth.currentUser.email) {
        arr.push([doc.id, doc.data()]);
      }
    });
    setSearchedData(arr);
  };
  return (
    <SafeAreaView
      className="flex-1 pt-2"
      style={{ backgroundColor: "#f5fafa" }}
    >
      <View className="flex flex-row px-2">
        <View className="ml-2">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.goBack()}
            style={{ marginTop: "auto", marginBottom: "auto" }}
          >
            <Icon name="chevron-back" size={26} color="#000" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 flex flex-row bg-gray-300 m-2 p-2 px-4 rounded-xl">
          <Icon
            name="search-outline"
            size={20}
            color="#fff"
            style={{ marginTop: "auto", marginBottom: "auto" }}
          />
          <TextInput
            value={searchText}
            onChangeText={(txt) => {
              setSearchText(txt);
              searchProfile(txt);
            }}
            cursorColor={"#000"}
            placeholderTextColor={"#000"}
            placeholder="Search"
            className="mx-3 flex-1 my-auto text-black"
          />
        </View>
      </View>
      <View className="flex-1">
        {searchedData.map((datas, index) => {
          console.log(datas[0]);
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("VisitProfile", { data: datas[0] })
              }
              className="p-3 rounded  m-2 flex flex-row"
              key={index}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: datas[1]["image"] }}
                className="h-14 w-14 rounded-full"
              />
              <View className="px-3">
                <Text className="font-bold tracking-wider text-base">
                  {datas[1]["name"]}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default SearchProfile;
