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
import { db, auth, database } from "../../security/firebase";
import { push, ref } from "firebase/database";
const SearchChat = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const searchProfile = async (txt) => {
    const ref1 = collection(db, "user");
    const q = query(ref1, orderBy("name"));
    const q2 = query(q, startAt(txt));
    const q3 = query(q2, endAt(txt + "\uf8ff"));
    const snap = await getDocs(q3);
    const arr = [];
    snap.forEach(async (doc) => {
      if (doc.data()["email"] != auth.currentUser.email) {
        arr.push([doc.id, doc.data()]);
      }
    });
    const arr2 = [];
    const arr3 = [];
    for (var i = 0; i < arr.length; i++) {
      const d1 = arr[i];
      var id = "";
      const ref2 = collection(db, "chat");
      const ref3 = query(
        ref2,
        where("user", "in", [
          [d1[0], auth.currentUser.uid],
          [auth.currentUser.uid, d1[0]],
        ])
      );
      const snapshot = await getDocs(ref3);
      if (snapshot.size == 0) {
        id = push(ref(database, "chat")).key;
      } else {
        snapshot.forEach((datas) => {
          id = datas.id;
        });
      }
      arr3.push([d1[0], d1[1], id]);
    }
    setSearchedData(arr3);
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
        <View className="flex-1 flex flex-row bg-gray-300 m-2 p-2 px-4 rounded-xl mb-5">
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
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Chat", {
                  data: datas[1],
                  chatId: datas[2],
                  uid: datas[0],
                })
              }
              className="px-3 py-2 rounded  mx-4 flex flex-row "
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

export default SearchChat;
