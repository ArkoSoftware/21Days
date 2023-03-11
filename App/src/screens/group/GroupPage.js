import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import OpenComment from "../challenge/components/OpenComment";
import { auth, db } from "../../security/firebase";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore/lite";
import { postFeed } from "./functions/functions";
import CreateChallenge from "../../components/CreateChallenge/CreateChallenge";
import Loading from "../../components/Loading";
const GroupPage = ({ route, navigation }) => {
  const groupCode = route.params["data"][0];
  const [groupData, setGroupData] = useState();
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState("");
  const [following, setFollowing] = useState(false);
  const [postData, setPostData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState("");
  const [selectedPostData, setSelectedPostData] = useState("");
  const [openComment, setOpenComment] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newLikes, setNewLikes] = useState([]);
  const [privatePage, setPrivatePage] = useState(false);
  const [challengeData, setChallengeData] = useState([]);

  const getChallenges = async () => {
    const ref1 = collection(db, "challenges");
    const q = query(ref1, where("groupId", "==", groupCode));
    const snap = await getDocs(q);
    const arr = [];
    snap.forEach((data) => {
      arr.push([data.id, data.data()]);
    });
    setChallengeData(arr);
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
  const PublicPost = ({ data, postId }) => {
    if (newLikes.indexOf(postData) == -1) {
      if (data["likeList"].includes(auth.currentUser.uid)) {
        const arr = newLikes;
        arr.push(postId);
        setNewLikes(arr);
      }
    }
    return (
      <View className="flex flex-col  border-t border-gray-200 pb-2 bg-white my-1 mx-2 rounded-xl">
        <View className="flex flex-row px-7 py-1 pb-3 pt-4 ">
          <View>
            <TouchableOpacity
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
              <View className="flex flex-row">
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
                <Text className=" font-light text-sm my-auto">9h</Text>
              </View>
              <TouchableOpacity className="ml-auto">
                <Icon name="ellipsis-vertical-outline" size={20} color="#000" />
              </TouchableOpacity>
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
    return <PublicPost data={item[0]} postId={item[1]} />;
  };

  const getFollowing = async () => {
    const ref1 = doc(db, "group", groupCode);
    const snap = await getDoc(ref1);
    if (snap.data()["followerList"].includes(auth.currentUser.uid)) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  };

  const followAccount = async () => {
    setFollowing(true);
    const ref1 = doc(db, "group", groupCode);
    await updateDoc(ref1, {
      followerList: arrayUnion(auth.currentUser.uid),
    });
  };
  const unfollowAccount = async () => {
    setFollowing(false);
    const ref1 = doc(db, "group", groupCode);
    await updateDoc(ref1, {
      followerList: arrayRemove(auth.currentUser.uid),
    });
  };
  const getPostData = async () => {
    const ref1 = collection(db, "post");
    const q = query(ref1, where("groupCode", "==", groupCode));
    const snap = await getDocs(q);
    const arr = [];
    snap.forEach((docs) => {
      const data = docs.data();
      arr.push([data, docs.id]);
    });
    setPostData(arr);
  };
  const getAllData = async () => {
    const ref1 = doc(db, "group", groupCode);
    const snap = await getDoc(ref1);
    setGroupData(snap.data());
    setPrivatePage(snap.data().private);
  };
  useEffect(() => {
    getAllData();
    getFollowing();
    getPostData();
    getChallenges();
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-white">
      {groupData == null ? (
        <Loading />
      ) : (
        <ScrollView>
          <ImageBackground
            source={{
              uri: groupData["backgroundImage"],
            }}
            className="h-54 h-56 w-full"
          >
            <TouchableOpacity
              className="p-2 rounded-full bg-white absolute top-4 left-4"
              style={{ alignSelf: "flex-start" }}
              onPress={() => navigation.goBack()}
            >
              <Icon name="chevron-back" color={"#000"} size={17} />
            </TouchableOpacity>
            {groupData.user == auth.currentUser.uid ? (
              <>
                <TouchableOpacity
                  className="p-2 rounded-full bg-white absolute top-4 right-4"
                  style={{ alignSelf: "flex-start" }}
                  onPress={() => navigation.navigate("GroupSetting")}
                >
                  <Icon
                    name="ellipsis-vertical-outline"
                    color={"#000"}
                    size={17}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-2 rounded-full bg-white absolute top-16 right-4"
                  style={{ alignSelf: "flex-start" }}
                >
                  <Icon name="notifications-outline" color={"#000"} size={17} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  className="p-2 rounded-full bg-white absolute top-4 right-4"
                  style={{ alignSelf: "flex-start" }}
                >
                  <Icon name="notifications-outline" color={"#000"} size={17} />
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              className="p-2 rounded-full bg-white absolute bottom-4 right-4 flex flex-row space-x-2 px-4"
              style={{ alignSelf: "flex-start" }}
            >
              <Icon name="people-outline" color={"#000"} size={14} />
              <Text
                className={"text-gray-700 my-auto"}
                style={{ fontSize: 13 }}
              >
                {groupData["followers"]}
              </Text>
            </TouchableOpacity>

            {following ? (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setOpen(true)}
                className="bg-pink-700 rounded-xl flex flex-row p-2 absolute bottom-4 left-4"
                style={{ alignSelf: "flex-start" }}
              >
                <Icon
                  name="add-outline"
                  size={20}
                  style={{ marginTop: "auto", marginBottom: "auto" }}
                  color="#fff"
                />
                <Text className="text-white my-auto mx-2">
                  Create Challenge
                </Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </ImageBackground>

          <View className="p-5 border-b border-b-gray-100">
            <View className="flex flex-row">
              <View className="flex flex-row">
                <Text className="font-extrabold tracking-tighter text-2xl">
                  {groupData["name"]}
                </Text>
                <Icon
                  name="checkmark-circle"
                  size={14}
                  color="#2FA4F7"
                  style={{ marginLeft: 3 }}
                />
              </View>
              {following ? (
                <TouchableOpacity
                  activeOpacity={0.9}
                  className="p-2 rounded-full flex flex-row space-x-2 px-5 ml-auto"
                  style={{ borderColor: "#3880FF", borderWidth: 1 }}
                  onPress={() => unfollowAccount()}
                >
                  <Text
                    className="font-bold my-auto tracking-tight text-white mx-auto"
                    style={{ color: "#3880FF" }}
                  >
                    Joined
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.9}
                  className="p-2 rounded-full flex flex-row space-x-2 px-5 ml-auto"
                  onPress={() => followAccount()}
                  style={{
                    backgroundColor: "#3880FF",
                    borderWidth: 1,
                    borderColor: "#3880ff",
                  }}
                >
                  <Text
                    className="font-bold my-auto tracking-tight text-white mx-auto"
                    style={{ color: "#fff" }}
                  >
                    Follow
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text
              className="tracking-tighter text-sm text-gray-500 mt-2"
              style={{ fontSize: 13 }}
            >
              {groupData["description"]}
            </Text>
          </View>
          {following || !privatePage ? (
            <>
              <View className="bg-white flex flex-col px-5 pb-5 mt-3">
                {following ? (
                  <View className="flex flex-row space-x-3">
                    <Image
                      source={{ uri: auth.currentUser.photoURL }}
                      className="w-10 h-10 rounded-full my-auto"
                    />

                    <View className="border border-gray-300 px-3 py-2 rounded-xl flex-1 flex flex-row">
                      <TextInput
                        placeholder="What's on your mind?"
                        onChangeText={(txt) => {
                          setPostText(txt);
                        }}
                        value={postText}
                        editable={!loading}
                        multiline
                        numberOfLines={2}
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
                            <Icon
                              name="close-circle-outline"
                              color="#9f9f9f"
                              size={22}
                            />
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
                            setPostData,
                            groupCode
                          )
                        }
                        className="bg-blue-600 rounded-xl flex-1"
                        style={{ padding: 16, alignSelf: "flex-start" }}
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
                ) : (
                  <></>
                )}
              </View>

              <View className="bg-gray-200 p-2">
                {challengeData.length != 0 ? (
                  <View className="bg-white rounded-xl px-4 py-4">
                    <Text className="text-2xl font-bold tracking-tighter p-2 py-4 pt-0">
                      Challenges
                    </Text>
                    <ScrollView horizontal={true}>
                      {challengeData.map((d1) => {
                        return (
                          <TouchableOpacity
                            onPress={() => navigation.navigate("Post", d1)}
                            className=" mx-2"
                          >
                            <ImageBackground
                              source={{ uri: d1[1].image }}
                              className="w-44 h-32 rounded-xl"
                              imageStyle={{ borderRadius: 10 }}
                            >
                              <View className="p-2 flex flex-col">
                                <View
                                  className="flex flex-row bg-white rounded-sm p-1 ml-auto space-x-1"
                                  style={{ alignSelf: "flex-start" }}
                                >
                                  <Icon
                                    name="heart"
                                    color={"#FE251B"}
                                    style={{
                                      marginTop: "auto",
                                      marginBottom: "auto",
                                    }}
                                  />
                                  <Text>{d1[1].likes}</Text>
                                </View>
                              </View>
                            </ImageBackground>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                ) : (
                  <></>
                )}
              </View>
              {postData.length != 0 ? (
                <View className="flex-1 bg-gray-200 py-2">
                  <FlatList
                    refreshing={refreshing}
                    onRefresh={() => getPostData()}
                    data={postData}
                    contentContainerStyle={{
                      flexGrow: 1,
                    }}
                    renderItem={renderItem}
                  />
                </View>
              ) : (
                <></>
              )}
              <OpenComment
                navigation={navigation}
                open={openComment}
                setOpen={setOpenComment}
                selectedPost={selectedPost}
                selectedPostData={selectedPostData}
              />
            </>
          ) : (
            <></>
          )}
        </ScrollView>
      )}
      <View className="z-50">
        <CreateChallenge
          group={true}
          groupId={groupCode}
          open={open}
          setOpen={setOpen}
        />
      </View>
    </SafeAreaView>
  );
};

export default GroupPage;
