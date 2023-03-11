import { View, Text, Image, ScrollView, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../../../security/firebase";
import Loading from "../../../components/Loading";
const MemberManagement = ({ route, navigation }) => {
  const data = route.params["data"];
  const [memberData, setMemberData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const getMemberList = async () => {
    const doc1 = doc(db, "group", data[0]);
    const snap = await getDoc(doc1);
    const list = snap.data()["followerList"];
    const arr = [];
    for (let i = 0; i < list.length; i++) {
      const doc2 = doc(db, "user", list[i]);
      const snap2 = await getDoc(doc2);
      arr.push(snap2.data());
    }
    setMemberData(arr);
  };
  useEffect(() => {
    getMemberList();
  }, []);

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="p-4 flex flex-row">
        <Icon
          onPress={() => navigation.goBack()}
          name="chevron-back"
          size={24}
          color="#000"
        />
        <Text className="text-xl font-bold tracking-widest my-auto mx-6">
          Group Members
        </Text>
      </View>
      {memberData.length == 0 ? (
        <Loading />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                getMemberList();
              }}
            />
          }
        >
          {memberData.map((docs) => {
            return (
              <View className="flex flex-row bg-gray-100 rounded-xl p-4 mx-7">
                <Image
                  source={{ uri: docs.image }}
                  className="h-12 w-12 rounded-full"
                />
                <Text className=" mx-5 text-xl font-bold tracking-tighter">
                  {docs.name}
                </Text>
                <View className="ml-auto">
                  <Icon
                    name="ellipsis-vertical-outline"
                    color={"#2f2f2f"}
                    size={16}
                  />
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default MemberManagement;
