import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "../../security/firebase";
import {
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore/lite";
import Loading from "../../components/Loading";
const ChatList = ({ navigation }) => {
  const [chatListData, setChatListData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getChatList = async () => {
    const checkRef = query(
      collection(db, "chat"),
      where("user", "array-contains", auth.currentUser.uid)
    );
    const snap = await getDocs(checkRef);

    if (snap.size == 0) {
    } else {
      const arr = [];
      for (let docs of snap.docs) {
        const userList = docs.data()["user"];
        for (var i = 0; i < userList.length; i++) {
          if (userList[i] != auth.currentUser.uid) {
            const ref1 = doc(db, "user", userList[i]);
            const snap2 = await getDoc(ref1);
            arr.push([docs.id, snap2.data(), userList[i]]);
          }
        }
      }
      setChatListData(arr);
    }
  };
  useEffect(() => {
    getChatList();
  }, []);

  const ChatUnit = ({ data }) => {
    const d1 = data[1];

    console.log(d1);
    if (d1 != null) {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Chat", {
              data: data[1],
              chatId: data[0],
              uid: data[2],
            })
          }
          activeOpacity={0.9}
          className="p-6 py-3 flex flex-row bg-white border-b border-b-gray-100"
        >
          <View>
            <Image
              source={{ uri: d1["image"] }}
              className="w-14 h-14 rounded-full"
            />
          </View>
          <View className="flex-1 flex flex-col my-auto mx-5 ">
            <Text className="text-base font-bold text-gray-700 mb-1">
              {d1["name"]}
            </Text>
          </View>
          <View className="flex flex-col">
            <Text className="my-auto text-center" style={{ fontSize: 12 }}>
              12:43
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="pt-4 pb-3 px-5 flex flex-row border-b border-gray-100">
        <Text className="text-3xl font-extrabold">Chat</Text>
      </View>
      {chatListData.length == 0 ? (
        <Loading message={"Start your first conversation"} />
      ) : (
        <ScrollView
          className="flex-1 bg-white"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                getChatList();
                setRefreshing(false);
              }}
            />
          }
        >
          {chatListData.map((data, index) => {
            return <ChatUnit data={data} key={index} />;
          })}
        </ScrollView>
      )}
      <TouchableOpacity
        className="ml-auto absolute bottom-7 right-7 rounded-full bg-pink-700 p-4 z-50"
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Search")}
      >
        <Icon
          name="search-outline"
          size={25}
          color={"#fff"}
          style={{
            marginTop: "auto",
            marginBottom: "auto",
            transform: [{ rotateZ: "90deg" }],
          }}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChatList;
