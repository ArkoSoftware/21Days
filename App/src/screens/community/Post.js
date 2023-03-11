import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useFonts } from "expo-font";
import { auth, db } from "../../security/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore/lite";
import Comment from "./component/Comment";
import {
  BookMark,
  JoinChallenge,
  leaveGroup,
  removeBookMark,
} from "./functions/JoinChallenge";
import Loading from "../../components/Loading";
import { ProgressCircle } from "react-native-svg-charts";
import {SendNotification} from "../notification/SendNotification";

const postComment = async function (comment, challenge) {
  const ref1 = collection(db, "challengeComment", challenge, "record");
  const snap = await addDoc(ref1, {
    comment,
    user: auth.currentUser.uid,
    profileImage: auth.currentUser.photoURL,
    name: auth.currentUser.displayName,
    time: serverTimestamp(),
    likes: 0,
  }).then(() => {
    return true;
  });
};

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

const Post = ({ navigation, route }) => {
  const item = route.params;
  const [profileData, setProfileData] = useState();
  const [rerender, setRerender] = useState(false);
  const [commentRe, setCommentRe] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState("");
  const [name, setName] = useState("");
  const [following, setFollowing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [bookMarked, setBookMarked] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const getProfileImage = async () => {
    setLoading(true);
    const r1 = doc(db, "user", item[1].user);
    const snap = await getDoc(r1);
    setProfileData(snap.data());
    setProfileImage(snap.data().image);
    if (snap.data().challengeList) {
      if (snap.data().challengeList.includes(item[0])) {
        setFollowing(true);
      }
    }
    if (snap.data().requestSent) {
      if (snap.data().requestSent.includes(item[0])) {
        setRequestSent(true);
      }
    }
    setBookMarked(
      snap.data().bookMarkList
        ? snap.data().bookMarkList.includes(item[0])
          ? true
          : false
        : false
    );
    setName(snap.data().name);
    setLoading(false);
  };
  useEffect(() => {
    getProfileImage();
  }, [rerender]);

  const [fontsLoaded] = useFonts({
    font1: require("../../../assets/fonts/Overpass-VariableFont_wght.ttf"),
    font2: require("../../../assets/fonts/HindMadurai-Medium.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {}, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }
  const ago = item[1].startDate.seconds - new Date().getTime() / 1000;
  const duration = parseInt(
    (item[1].endDate.seconds - item[1].startDate.seconds) / 86400
  );
  const diff = parseInt(ago / 86400);
  const today = parseInt(new Date().getTime() / 1000);
  return (
    <SafeAreaView className="flex flex-col flex-1 bg-white">
      {loading ? (
        <Loading />
      ) : (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => setRerender(!rerender)}
              />
            }
            className="flex-1"
          >
            <ImageBackground
              style={{ backgroundColor: "#000" }}
              imageStyle={{ opacity: 0.7 }}
              source={{ uri: item[1].image }}
              className="w-full h-96"
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="mx-5 mt-3 rounded-full bg-white w-10 h-10"
              >
                <Icon
                  name="chevron-back"
                  size={25}
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                />
              </TouchableOpacity>
              <View className=" absolute top-3 right-2 flex flex-col space-y-2">
                {item[1].user == auth.currentUser.uid ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("GoalSetting", {
                        id: item[0],
                        data: item,
                      })
                    }
                    activeOpacity={0.9}
                    className="ml-auto"
                    style={{ alignSelf: "flex-start" }}
                  >
                    <View
                      className="rounded-full p-2 bg-white flex flex-row space-x-2"
                      style={{ alignSelf: "flex-start" }}
                    >
                      <Icon
                        name="ellipsis-vertical-outline"
                        color="#C2185B"
                        size={16}
                        style={{ marginTop: "auto", marginBottom: "auto" }}
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
                <TouchableOpacity
                  className="ml-auto"
                  style={{ alignSelf: "flex-start" }}
                >
                  <View
                    className="rounded-full p-2 px-4 bg-white flex flex-row space-x-2 "
                    style={{ alignSelf: "flex-start" }}
                  >
                    <Icon
                      name="heart"
                      color="#C2185B"
                      size={16}
                      style={{ marginTop: "auto", marginBottom: "auto" }}
                    />
                    <Text
                      className="text-pink-700 text-center my-auto"
                      style={{ fontSize: 15 }}
                    >
                      {item[1].likes}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View
                  className="text-base px-5 py-2 my-5 rounded-full bg-white flex flex-row ml-auto"
                  style={{ alignSelf: "flex-start" }}
                >
                  <Icon
                    name="people"
                    size={16}
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
                    {item[1].followers}
                  </Text>
                </View>
                <View style={{ alignSelf: "flex-start" }}>
                  <View
                    className="rounded-full p-2 px-4 bg-pink-700 flex flex-row space-x-3 "
                    style={{ alignSelf: "flex-start" }}
                  >
                    <Icon name={item[1].category[0]} size={16} color={"#fff"} />
                    <Text
                      className="text-white text-center my-auto"
                      style={{ fontSize: 12 }}
                    >
                      {item[1].category[1]}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (!bookMarked) {
                    BookMark(item);
                    setBookMarked(!bookMarked);
                  } else {
                    removeBookMark(item);
                    setBookMarked(!bookMarked);
                  }
                }}
                className="text-base px-3 py-2 my-5 rounded-full bg-white absolute bottom-12 right-5 flex flex-row"
                style={{ alignSelf: "flex-start" }}
              >
                <Icon
                  name={bookMarked ? "bookmark" : "bookmark-outline"}
                  size={16}
                  color={"#EDAA0C"}
                />
              </TouchableOpacity>
              <View
                className="rounded-full p-2 px-4 bg-pink-700 mt-auto mb-5 ml-5"
                style={{ alignSelf: "flex-start" }}
              >
                <Text
                  className="text-center text-white"
                  style={{ fontSize: 12 }}
                >
                  {new Date(item[1].startDate.seconds * 1000).toDateString()}
                </Text>
              </View>
              {following ? (
                <TouchableOpacity
                  style={{ borderRadius: 10, alignSelf: "flex-start" }}
                  className="bg-green-200 00 p-3 px-6 border border-green-600 absolute right-5 bottom-4"
                >
                  <Text
                    className="text-black text-center mx-auto"
                    style={{ alignSelf: "flex-start" }}
                  >
                    Joined
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  {requestSent ? (
                    <TouchableOpacity
                      onPress={() => {
                        if (item.public) {
                          JoinChallenge(item);
                          setFollowing(!following);
                        } else {
                          JoinChallenge(item);
                          setRequestSent(true);
                        }
                      }}
                      style={{ borderRadius: 10, alignSelf: "flex-start" }}
                      className="bg-blue-100 p-3 px-6 border border-blue-700 absolute right-5 bottom-4"
                    >
                      <Text
                        className="text-blue-700 text-center mx-auto"
                        style={{ alignSelf: "flex-start" }}
                      >
                        Request Sent
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        if (item.public) {
                          JoinChallenge(item);
                          setFollowing(!following);
                        } else {
                          JoinChallenge(item);
                          setRequestSent(true);
                          SendNotification('Somebody has sent a join request','',item[1].user)
                        }
                      }}
                      style={{ borderRadius: 10, alignSelf: "flex-start" }}
                      className="bg-green-700 p-3 px-6 border border-white absolute right-5 bottom-4"
                    >
                      <Text
                        className="text-gray-200 text-center mx-auto"
                        style={{ alignSelf: "flex-start" }}
                      >
                        Join Challenge
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </ImageBackground>
            <View>
              <View className="flex flex-row p-5">
                <View className="flex flex-col my-auto">
                  <Text
                    className=" font-bold tracking-tighter"
                    style={{ fontSize: 27 }}
                  >
                    {item[1].taskTitle}
                  </Text>
                </View>
                <View className="flex flex-col ml-auto space-y-3">
                  <Image
                    source={{ uri: profileImage }}
                    className=" h-12 w-12 rounded-full ml-auto mx-auto"
                  />
                </View>
              </View>
              {following ? (
                <>
                  {!(today > item[1].endDate.seconds) ? (
                    <>
                      {today < item[1].startDate.seconds ? (
                        <View>
                          <Icon
                            style={{
                              marginLeft: "auto",
                              marginRight: "auto",
                              marginTop: "10%",
                            }}
                            name="flower"
                            color={"#8f8f8f"}
                            size={46}
                          />
                          <Text className="text-center mt-7 text-sm text-gray-500 tracking-tighter">
                            The Challenge Will Begin in {diff} day
                          </Text>
                        </View>
                      ) : (
                        <View className="flex flex-row">
                          <View className=" w-36 p-5 ">
                            <View>
                              <ProgressCircle
                                style={{ height: 100 }}
                                progress={(diff + 1) / duration}
                                strokeWidth={20}
                                progressColor={"rgb(134, 65, 244)"}
                              />
                            </View>
                            <Text className="text-center font-bold text-base mt-3">
                              Progress
                            </Text>
                            <Text className="text-center">
                              {diff + 1}/{duration}
                            </Text>
                          </View>
                          <View className="flex-1 px-7 flex flex-col">
                           
                            <TouchableOpacity onPress={()=>{leaveGroup(item);navigation.goBack()}} className=" p-3 rounded-xl bg-red-800 w-full mt-5 ">
                              <Text className="text-white text-center">
                                Leave Challenge
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </>
                  ) : (
                    <View className="flex flex-col">
                      <View className="mb-8 px-4">
                        <Text className="p-3 bg-blue-500 text-white rounded-xl w-full text-center">
                          This Challenge ended
                          {" " + formatTimeElapsed(item[1].endDate)}
                        </Text>
                      </View>
                    </View>
                  )}
                </>
              ) : (
                <></>
              )}

              <View
                className="mx-5 border-b border-b-gray-400"
                style={{ alignSelf: "flex-start" }}
              >
                <Text className="text-base">Comments</Text>
              </View>
              <View className="p-5">
                <Comment rerender={commentRe} post={item} />
              </View>
            </View>
          </ScrollView>

          <View className="mt-auto flex flex-row p-3 pt-3 space-x-3 border-t border-t-gray-200">
            <Image
              source={{ uri: auth.currentUser.photoURL }}
              className="w-8 h-8 rounded-full my-auto"
            />
            <TextInput
              value={newComment}
              onChangeText={(text) => setNewComment(text)}
              placeholder="Comment..."
              className="flex-1 my-auto"
            />
            <TouchableOpacity
              onPress={() => {
                if (newComment != "") {
                  setNewComment("");

                  if (postComment(newComment, item[0])) {
                    setCommentRe(!commentRe);
                  }
                }
              }}
              className="ml-auto my-auto h-full"
            >
              <Text className="text-blue-600 font-bold ">Comment</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Post;
