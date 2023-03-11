import {
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import Logo from "../../../assets/image/logo.png";
import FeedScroll from "./FeedScroll";
import AddGoal from "../challenge/components/AddGoal";
import CreateChallenge from "../../components/CreateChallenge/CreateChallenge";
import SavedChallenges from "./component/SavedChallenges";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore/lite";
import { auth, db } from "../../security/firebase";
import Loading from "../../components/Loading";
import { ScrollView } from "react-native-gesture-handler";

const Feed = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const [yourData, setYourData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reRender, setRender] = useState(false);

  const getChallengesData = async () => {
    setLoading(true);
    const doc1 = collection(db, "challenges");
    const q = query(
      doc1,
      where("followerList", "array-contains", auth.currentUser.uid)
    );
    const snap = await getDocs(q);
    const arr = [];
    snap.forEach((docs) => {
      const data = docs.data();
      arr.push([docs.id, data]);
    });
    setYourData(arr);
    setLoading(false);
  };

  useEffect(() => {
    getChallengesData();
  }, [reRender]);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => setRender(!reRender)}
        />
      }
      className="flex-1 bg-white"
    >
      <SafeAreaView className="flex-1">
        <View className="flex flex-row px-6 py-3 pt-5">
          <View className="flex-1 flex-row">
            <Text className="my-auto font-extrabold text-3xl text-gray-700">
              Challenges
            </Text>
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setOpen(true)}
              className="bg-pink-700 rounded-xl flex flex-row p-2"
            >
              <Icon
                name="add-outline"
                size={20}
                style={{ marginTop: "auto", marginBottom: "auto" }}
                color="#fff"
              />
              <Text className="text-white my-auto mx-2">Create</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-4">
          {loading ? (
            <Loading />
          ) : (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {yourData.map((item) => {
                const ago =
                  item[1].startDate.seconds - new Date().getTime() / 1000;
                const duration = parseInt(
                  (item[1].endDate.seconds - item[1].startDate.seconds) / 86400
                );
                const diff = parseInt(ago / 86400);
                if (diff >= 0) {
                  return (
                    <SavedChallenges item={item} navigation={navigation} />
                  );
                } else return null;
              })}
            </ScrollView>
          )}
        </View>

        <FeedScroll navigation={navigation} reRender={reRender} />
      </SafeAreaView>
      <View className="z-50">
        <CreateChallenge open={open} setOpen={setOpen} group={false} />
      </View>
    </ScrollView>
  );
};

export default Feed;
