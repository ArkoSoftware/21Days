import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, database, db } from "../../security/firebase";
import OpenEllipsis from "./OpenEllipsis";
import {
  onValue,
  orderByChild,
  push,
  query,
  ref,
  serverTimestamp,
} from "firebase/database";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  where,
} from "firebase/firestore/lite";
import Loading from "../../components/Loading";

const ChatList = ({ navigation, route }) => {
  const data = route.params["data"];
  const uid = route.params["uid"];
  const [chatId, setChatId] = useState(route.params["chatId"] || null);
  const [openEllipsis, setOpenEllipsis] = useState(false);
  const [chatData, setChatData] = useState([]);
  const [message, setMessage] = useState("");
  const [trigger, setTrigger] = useState(false);
  const [loading, setLoading] = useState(true);

  const deleteData = async () => {
    if (chatId != null || chatId != "") {
      const checkRef = query(
        collection(db, "chat"),
        where("user", "in", [
          [auth.currentUser.uid, uid],
          [uid, auth.currentUser.uid],
        ])
      );
      const snap = await getDocs(checkRef);
      if (!snap.empty) {
        snap.forEach(async (docs) => {
          const data = docs.data();
          const val = docs.id;
          const checkRef2 = doc(db, "chat", val);
          const snap2 = deleteDoc(checkRef2);
        });
      }
    }
  };
  const checkIfExists = async () => {
    if (chatId != null || chatId != "") {
      const checkRef = query(
        collection(db, "chat"),
        where("user", "in", [
          [auth.currentUser.uid, uid],
          [uid, auth.currentUser.uid],
        ])
      );
      const snap = await getDocs(checkRef);
      if (snap.size != 0) {
        snap.forEach((doc1) => {
          setChatId(doc1.id);
          setTrigger(!trigger);
        });
      }
    }
  };
  useEffect(() => {
    checkIfExists();
    onValue(
      query(ref(database, "chat/" + chatId), orderByChild("time")),
      (snapshot) => {
        const arr = [];
        snapshot.forEach((datas) => {
          arr.push(datas.val());
        });
        setChatData(arr);
        setLoading(false);
      }
    );
  }, [trigger]);
  const sendMessage = async () => {
    if (message != "") {
      const r1 = doc(db, "chat", chatId);
      const snap = await getDoc(r1);
      if (snap.exists) {
        await setDoc(r1, { user: [uid, auth.currentUser.uid] });
      }

      push(ref(database, "chat/" + chatId), {
        message: message,
        time: serverTimestamp(),
        sender: auth.currentUser.uid,
        receiver: uid,
      });
      setMessage("");
    }
  };
  const RenderItem = ({ item }) => {
    if (item["sender"] == auth.currentUser.uid) {
      return (
        <View className="flex flex-row py-2">
          <View
            className="bg-blue-500 w-auto px-3 mt-1 py-2 ml-auto rounded-xl my-auto"
            style={{ transform: [{ scaleY: 1 }] }}
          >
            <Text className="text-base text-white">{item["message"]}</Text>
          </View>
          <Image
            source={{ uri: auth.currentUser.photoURL }}
            className="h-8 w-8 my-auto rounded-full ml-3"
          />
        </View>
      );
    } else {
      return (
        <View className="flex flex-row py-2">
          <Image
            source={{ uri: data["image"] }}
            className="h-8 w-8 my-auto rounded-full mr-3"
          />
          <View
            className="bg-gray-500 w-auto px-3 mt-1 py-2 mr-auto rounded-xl"
            style={{ transform: [{ scaleY: 1 }] }}
          >
            <Text className="text-base text-white">{item["message"]}</Text>
          </View>
        </View>
      );
    }
  };
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#f5fafa" }}>
      <View className="pt-4 pb-3 px-5 flex flex-row border-b border-gray-300 rounded-xl">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.goBack()}
        >
          <Icon
            name="chevron-back"
            size={27}
            color={"#C2185B"}
            style={{ marginTop: "auto", marginBottom: "auto" }}
          />
        </TouchableOpacity>
        <View className="flex flex-row px-5">
          <Image
            source={{ uri: data["image"] }}
            className="w-10 h-10 rounded-full"
          />
          <Text className="font-light text-base my-auto mx-3">
            {data["name"]}
          </Text>
        </View>
        <TouchableOpacity
          className="ml-auto"
          onPress={() => setOpenEllipsis(!openEllipsis)}
        >
          <Icon
            name="ellipsis-vertical-outline"
            size={25}
            color={"#C2185B"}
            style={{
              marginLeft: "auto",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View className="flex-1 bg-blue-500">
          <Loading />
        </View>
      ) : (
        <View className="flex-1 px-5">
          <View className="mt-auto">
            <FlatList
              showsVerticalScrollIndicator={false}
              inverted={true}
              data={chatData}
              renderItem={RenderItem}
              contentContainerStyle={{ flexDirection: "column-reverse" }}
            />
          </View>
        </View>
      )}
      <View className=" bg-gray-200 rounded-xl px-3 py-1 m-4 flex flex-row">
        <TextInput
          placeholder="Enter Your Message"
          className="flex-1"
          multiline
          numberOfLines={2}
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity className="my-auto p-2 pl-4 rounded-full">
          <Icon
            onPress={() => sendMessage()}
            name="paper-plane"
            color={"#C2185B"}
            size={24}
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          />
        </TouchableOpacity>
      </View>
      <OpenEllipsis
        navigation={navigation}
        open={openEllipsis}
        setOpen={setOpenEllipsis}
        deleteData={deleteData}
      />
    </SafeAreaView>
  );
};

export default ChatList;
