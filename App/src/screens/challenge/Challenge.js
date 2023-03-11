import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "../../security/firebase";
import AddGoal from "./components/AddGoal";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore/lite";
import * as ImagePicker from "expo-image-picker";
import { postFeed } from "./functions/Function";
import OpenComment from "./components/OpenComment";
import Loading from "../../components/Loading";
import OpenEllipsis from "./components/OpenEllipsis";
function formatTimeElapsed(timestamp) {
  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = 60 * MS_PER_SECOND;
  const MS_PER_HOUR = 60 * MS_PER_MINUTE;
  const MS_PER_DAY = 24 * MS_PER_HOUR;
  const MS_PER_WEEK = 7 * MS_PER_DAY;
  const MS_PER_MONTH = 30.44 * MS_PER_DAY;
  const MS_PER_YEAR = 365 * MS_PER_DAY;

  const now = Date.now();
  const timestampMs =
    timestamp.seconds * MS_PER_SECOND + timestamp.nanoseconds / 1000000;
  const elapsedMs = now - timestampMs;

  if (elapsedMs < MS_PER_MINUTE) {
    return "Just now";
  } else if (elapsedMs < MS_PER_HOUR) {
    const minutes = Math.round(elapsedMs / MS_PER_MINUTE);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (elapsedMs < MS_PER_DAY) {
    const hours = Math.round(elapsedMs / MS_PER_HOUR);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (elapsedMs < MS_PER_WEEK) {
    const days = Math.round(elapsedMs / MS_PER_DAY);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (elapsedMs < MS_PER_MONTH) {
    const weeks = Math.round(elapsedMs / MS_PER_WEEK);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (elapsedMs < MS_PER_YEAR) {
    const months = Math.round(elapsedMs / MS_PER_MONTH);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    if (years == null) {
      return "Just Now";
    }
    const years = Math.round(elapsedMs / MS_PER_YEAR);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
}

// example usage

const Challenge = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState("");
  const [selectedPostData, setSelectedPostData] = useState("");
  const [openComment, setOpenComment] = useState(false);
  const [openEllipsis, setOpenEllipsis] = useState(false);
  const [postText, setPostText] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [postData, setPostData] = useState([]);
  const [newLikes, setNewLikes] = useState([]);
  const [reRender, setRender] = useState(false);
  const [image, setImage] = useState("");
  const getPostData = async () => {
    const ref1 = collection(db, "post");
    const snap = await getDocs(ref1);
    const arr = [];
    snap.forEach(async (docs) => {
      const data = docs.data();

      arr.push([data, docs.id]);
    });
    for (var i = 0; i < arr.length; i++) {
      let group;
      if (arr[i][0].groupCode) {
        const ref1 = doc(db, "group", arr[i][0].groupCode);
        const snap1 = await getDoc(ref1);
        group = snap1.data();
        arr[i][2] = group;
      }
    }
    setPostData(arr);
  };
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
      base64: true,
    });

    if (!result.canceled) {
      setImage(result["assets"][0]["uri"]);
    } else {
    }
  };
  const likeImage = async (userId, postId) => {
    const arr = newLikes;
    arr.push(postId);
    setNewLikes([...arr]);
    const ref1 = doc(db, "post", postId);
    const snap = await updateDoc(ref1, { likes: increment(1) });
    const snap2 = await updateDoc(ref1, { likeList: arrayUnion(userId) });
  };
  const unLikeImage = async (userId, postId) => {
    const arr = newLikes;
    arr.splice(arr.indexOf(postId), 1);
    setNewLikes([...arr]);
    const ref1 = doc(db, "post", postId);
    const snap = await updateDoc(ref1, { likes: increment(-1) });
    const snap2 = await updateDoc(ref1, { likeList: arrayRemove(userId) });
  };
  const PublicPost = ({ data, postId, group }) => {
    if (newLikes.indexOf(postData) == -1) {
      if (data["likeList"].includes(auth.currentUser.uid)) {
        const arr = newLikes;
        arr.push(postId);
        setNewLikes(arr);
      }
    }
    console.log(group);
    return (
      <View className="flex flex-col  border-t border-gray-200 pb-2 my-1 mx-2 bg-white rounded-xl">
        <View className="flex flex-row px-4 py-1 pb-3 pt-4">
          <View>
            <TouchableOpacity
              className="flex flex-row"
              onPress={() => {
                if (auth.currentUser.uid == data.userId) {
                  navigation.navigate("ProfileRouter");
                } else {
                  navigation.navigate("VisitProfile", { data: data.userId });
                }
              }}
            >
              <Image
                source={{ uri: data.profileImage }}
                className="w-12 h-12 rounded-full mb-auto"
              />
            </TouchableOpacity>
          </View>
          <View className="flex flex-col pl-3 flex-1">
            <View className="flex flex-row">
              {"groupCode" in data ? (
                <View>
                  <Text className=" font-extrabold text-base mr-2">
                    {group.name} .
                  </Text>
                </View>
              ) : (
                <></>
              )}
              <TouchableOpacity
                onPress={() => {
                  if (auth.currentUser.uid == data.userId) {
                    navigation.navigate("ProfileRouter");
                  } else {
                    navigation.navigate("VisitProfile", { data: data.userId });
                  }
                }}
              >
                <Text className=" font-extrabold text-base mr-2">
                  {data.username}
                </Text>
              </TouchableOpacity>
              <View className="flex flex-row flex-1">
                <Icon
                  name="stop"
                  size={3}
                  color="#9f9f9f"
                  style={{
                    marginTop: "auto",
                    marginBottom: "auto",
                    marginRight: 5,
                  }}
                />
                <Text className=" font-light text-sm my-auto">
                  {data.timestamp
                    ? formatTimeElapsed(data["timestamp"])
                    : "Just Now"}
                </Text>
                {"groupCode" in data ? (
                  <Image
                    source={{ uri: group.backgroundImage }}
                    className="w-6 h-6 rounded-full mb-auto ml-auto"
                  />
                ) : (
                  <></>
                )}
              </View>
            </View>
            <Text className="tracking-wide mt-1">{data.post}</Text>
          </View>
        </View>
        <View className="px-5">
          {"url" in data ? (
            <Image
              className="mx-auto"
              resizeMode="cover"
              source={{ uri: data.url }}
              style={{
                resizeMode: "cover",
                width: "100%",
                height: 300,
                borderRadius: 10,
                marginBottom: 16,
              }}
            />
          ) : (
            <></>
          )}
        </View>

        <View className="flex flex-row px-5 mb-2">
          <View className="flex-1 flex flex-row space-x-5">
            {newLikes.includes(postId) ? (
              <TouchableOpacity
                onPress={() => {
                  unLikeImage(data.userId, postId);
                }}
              >
                <Icon name="heart" size={24} color="#EA4335" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  likeImage(data.userId, postId);
                }}
              >
                <Icon name="heart-outline" size={24} color="#4f4f4f" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                setSelectedPost(postId);
                setSelectedPostData(data);
                setOpenComment(true);
              }}
            >
              <Icon name="chatbox-outline" size={24} color="#4f4f4f" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  const renderItem = ({ item }) => {
    return <PublicPost data={item[0]} postId={item[1]} group={item[2]} />;
  };
  useEffect(() => {
    getPostData();
  }, [reRender]);
  return (
    <SafeAreaView className=" flex-1 bg-white">
      <View className="b-white flex flex-row p-5 ">
        <Text className="text-3xl font-bold tracking-wide ">Community</Text>
        <View className="flex flex-row ml-auto">
          <TouchableOpacity
            activeOpacity={0.9}
            className="ml-auto my-auto mr-3"
            onPress={() => navigation.navigate("Search")}
          >
            <Icon name="search-outline" size={27} color="#2f2f2f" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            className="ml-auto my-auto mr-3"
            onPress={() => navigation.navigate("Notification")}
          >
            <Icon name="notifications-outline" size={27} color="#2f2f2f" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="bg-white flex flex-col px-5 pb-5">
        <View className="flex flex-row space-x-3">
          <Image
            source={{ uri: auth.currentUser.photoURL }}
            className="w-10 h-10 rounded-full my-auto"
          />
          <View className="border border-gray-300 px-3 py-2 rounded-xl flex-1 flex flex-row">
            <TextInput
              placeholder="Post Something"
              value={postText}
              editable={!loading}
              multiline
              numberOfLines={2}
              onChangeText={(txt) => setPostText(txt)}
              className="flex-1 mr-3 text-justify"
            />
            {image == "" ? (
              <TouchableOpacity
                onPress={() => pickImageAsync()}
                activeOpacity={0.9}
                className="my-auto ml-auto bg-blue-600 p-2"
                style={{ borderRadius: 7 }}
              >
                <Icon name="image-outline" color="#fff" size={18} />
              </TouchableOpacity>
            ) : (
              <View className="flex flex-row ml-auto">
                <TouchableOpacity
                  onPress={() => pickImageAsync()}
                  activeOpacity={0.9}
                  className="my-auto ml-auto bg-blue-600"
                  style={{ borderRadius: 7 }}
                >
                  <Image
                    source={{ uri: image }}
                    className="h-8 w-8"
                    style={{ borderRadius: 7 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setImage("")}
                  activeOpacity={0.9}
                  className="my-auto ml-2"
                  style={{ borderRadius: 7 }}
                >
                  <Icon name="close-circle-outline" color="#9f9f9f" size={22} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View>
            <TouchableOpacity
              onPress={() =>
                postFeed(
                  setLoading,
                  setImage,
                  setPostText,
                  postText,
                  image,
                  postData,
                  setPostData
                )
              }
              className="bg-blue-600 rounded-xl flex-1"
              style={{ padding: 16, alignSelf: "flex-start" }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  size={16}
                  color="#fff"
                  className="mx-auto my-auto"
                />
              ) : (
                <Icon
                  name="paper-plane-outline"
                  size={16}
                  color="#fff"
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="flex-1 bg-gray-200">
        {postData.length == 0 ? (
          <Loading />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={() => getPostData()}
            data={postData}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            renderItem={renderItem}
          />
        )}
      </View>
      <OpenComment
        navigation={navigation}
        open={openComment}
        setOpen={setOpenComment}
        selectedPost={selectedPost}
        selectedPostData={selectedPostData}
      />
      <OpenEllipsis
        navigation={navigation}
        open={openEllipsis}
        setOpen={setOpenEllipsis}
        selectedPost={selectedPost}
        selectedPostData={selectedPostData}
      />
    </SafeAreaView>
  );
};

export default Challenge;
