import {
  SafeAreaView,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useMemo, useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import MasonryList from "@react-native-seoul/masonry-list";
import { collection, getDocs } from "firebase/firestore/lite";
import { auth, db } from "../../security/firebase";
import DoubleClick from "double-click-react-native";
import Loading from "../../components/Loading";
import { LikeChallenge, unLikeChallenge } from "./functions/JoinChallenge";
import {SendNotification} from "../notification/SendNotification";

const FeedScroll = ({ navigation, reRender }) => {
  const [likedPages, setLikedPages] = useState([]);
  const renderItem = ({ item, i }) => {
    return <FurnitureCard item={item} />;
  };
  const [feedData, setFeedData] = useState([]);
  const getFeed = async () => {
    const arr = [];
    const ref2 = collection(db, "challenges");
    const snap2 = await getDocs(ref2);
    const arr2 = [];
    snap2.forEach((datas) => {
      if (datas.data()["likedChallenge"]) {
        if (datas.data()["likedChallenge"].includes(auth.currentUser.uid)) {
          arr2.push(datas.id);
        }
      }
      arr.push([datas.id, datas.data()]);
    });
    setLikedPages(arr2);
    const shuffled = arr.sort((a, b) => 0.5 - Math.random());
    setFeedData(shuffled);
  };
  const FurnitureCard = ({ item }) => {
    var random_boolean = Math.random() < 0.5;
    return (
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Post", item)}
          activeOpacity={0.9}
          className="p-3 flex-1  "
        >
          <ImageBackground
            imageStyle={{ borderRadius: 10, opacity: 0.6 }}
            source={{ uri: item[1]["image"] }}
            style={{
              height: random_boolean ? 200 : 280,
              alignSelf: "stretch",
              borderRadius: 10,
              backgroundColor: "#000",
            }}
            resizeMode="cover"
          >
            <View
              className="text-base px-3 py-1 my-3 rounded-full bg-white absolute top-0 right-2 flex flex-row"
              style={{ alignSelf: "flex-start" }}
            >
              <Icon
                name="people"
                size={18}
                color={"#000"}
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  marginRight: 7,
                }}
              />
              <Text
                className="my-auto text-sm font-bold"
                style={{ color: "#000" }}
              >
                {item[1]["followers"] || 0}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        {!likedPages.includes(item[0]) ? (
          <TouchableOpacity
            onPress={() => {
              LikeChallenge(auth.currentUser.uid, item[0]);
              const arr = likedPages;
              arr.push(item[0]);
              setLikedPages([...arr]);
              SendNotification('Somebody Liked Your Post','',item[1].user)
            }}
            className="text-base p-2 my-3 rounded-full bg-white absolute bottom-3 right-5 flex flex-row"
            style={{ alignSelf: "flex-start" }}
          >
            <Icon
              name="heart-outline"
              size={18}
              color={"#000"}
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "auto",
                marginBottom: "auto",
              }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              const arr = likedPages;
              unLikeChallenge(auth.currentUser.uid, item[0]);
              const index = arr.indexOf(item[0]);
              if (index > -1) {
                arr.splice(index, 1);
              }
              setLikedPages([...arr]);
            }}
            className="text-base p-2 my-3 rounded-full bg-white absolute bottom-3 right-5 flex flex-row"
            style={{ alignSelf: "flex-start" }}
          >
            <Icon
              name="heart"
              size={18}
              color={"#D24291"}
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "auto",
                marginBottom: "auto",
              }}
            />
          </TouchableOpacity>
        )}

        {!item[1].habit ? (
          <View
            className="text-base px-3 py-2 my-3 rounded-full bg-red-500 absolute bottom-3 left-5 flex flex-row"
            style={{ alignSelf: "flex-start" }}
          >
            <Text className="my-auto mx-auto text-white">Goal</Text>
          </View>
        ) : (
          <View
            className="text-base px-3 py-2 my-3 rounded-full bg-green-500 absolute bottom-3 left-5  flex flex-row"
            style={{ alignSelf: "flex-start" }}
          >
            <Text className="text-white">Habit</Text>
          </View>
        )}
      </View>
    );
  };

  useEffect(() => {
    getFeed();
  }, [reRender]);

  return (
    <SafeAreaView className="flex-1">
      {feedData.length == 0 ? (
        <Loading />
      ) : (
        <MasonryList
          ListHeaderComponent={<View />}
          contentContainerStyle={{
            paddingHorizontal: 0,
            alignSelf: "stretch",
          }}
          numColumns={2}
          data={feedData}
          renderItem={renderItem}
          onRefresh={() => getFeed()}
        />
      )}
    </SafeAreaView>
  );
};

export default FeedScroll;
