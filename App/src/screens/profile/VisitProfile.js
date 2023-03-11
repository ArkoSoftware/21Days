import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore/lite";
import { auth, db } from "../../security/firebase";
import InlistedGroups from "./components/InlistedGroups";
import InlistedGoals from "./components/InlistedGoals";

const VisitProfile = ({ navigation, route }) => {
  const datas = route.params["data"];
  const [profileData, setProfileData] = useState([]);
  const [following, setFollowing] = useState(true);
  const [groupData, setGroupData] = useState([]);
  const [goalData, setGoalData] = useState([]);
  const [requestSent, setRequestSent] = useState(false);
  const [followBack, setFollowBack] = useState(false);
  const getProfileData = async () => {
    const ref = doc(db, "user", route.params["data"]);
    const snap = await getDoc(ref);
    const ref2 = doc(db, "user", auth.currentUser.uid);
    const snap2 = await getDoc(ref2);
    setProfileData(snap.data());
    if (snap.data["following"]) {
      if (snap.data()["following"].includes(auth.currentUser.uid)) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    } else {
      setFollowing(false);
    }

    if (snap.data()["friendRequests"]) {
      if (snap.data()["friendRequests"].includes(auth.currentUser.uid)) {
        setRequestSent(true);
      } else {
        setRequestSent(false);
      }
    } else {
      setRequestSent(false);
    }
    if (snap.data()["friendRequestSent"]) {
      if (snap.data()["friendRequestSent"].includes(auth.currentUser.uid)) {
        setFollowBack(true);
      } else {
        setFollowBack(false);
      }
    } else {
      setFollowBack(false);
    }
  };
  const getGroupData = async () => {
    const ref1 = collection(db, "group");
    const q = query(ref1, where("user", "==", datas));
    const snap = await getDocs(q);
    const arr = [];
    snap.forEach((data) => {
      arr.push([data.id, data.data()]);
    });
    setGroupData(arr);
  };
  const getGoalData = async () => {
    const ref1 = collection(db, "challenges");
    const q = query(ref1, where("user", "==", datas));
    const snap = await getDocs(q);
    const arr = [];
    snap.forEach((data) => {
      arr.push([data.id, data.data()]);
    });
    setGoalData(arr);
  };

  useEffect(() => {
    getProfileData();
    getGroupData();
    getGoalData();
  }, []);
  const [fontsLoaded] = useFonts({
    font1: require("../../../assets/fonts/Overpass-VariableFont_wght.ttf"),
    font2: require("../../../assets/fonts/HindMadurai-Medium.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {}, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  const sendFriendRequest = async () => {
    setRequestSent(true);
    const ref1 = doc(db, "user", auth.currentUser.uid);
    const ref2 = doc(db, "user", datas);
    const snap = await updateDoc(ref1, {
      friendRequestSent: arrayUnion(datas),
    });
    const snap2 = await updateDoc(ref2, {
      friendRequests: arrayUnion(auth.currentUser.uid),
    });
  };
  const unsendRequest = async () => {
    setRequestSent(false);
    const ref1 = doc(db, "user", auth.currentUser.uid);
    const ref2 = doc(db, "user", datas);
    const snap = await updateDoc(ref1, {
      friendRequestSent: arrayRemove(datas),
    });
    const snap2 = await updateDoc(ref2, {
      friendRequests: arrayRemove(auth.currentUser.uid),
    });
  };
  const acceptRequest = async () => {
    setFollowing(true);
    const ref1 = doc(db, "user", auth.currentUser.uid);
    const ref2 = doc(db, "user", datas);
    const snap = await updateDoc(ref1, {
      following: arrayUnion(datas),
    });
    const snap2 = await updateDoc(ref2, {
      following: arrayUnion(auth.currentUser.uid),
    });

    const snap3 = await updateDoc(ref1, {
      friendRequestSent: arrayRemove(datas),
    });
    const snap5 = await updateDoc(ref2, {
      friendRequestSent: arrayRemove(auth.currentUser.uid),
    });
    const snap4 = await updateDoc(ref2, {
      friendRequests: arrayRemove(auth.currentUser.uid),
    });
    const snap6 = await updateDoc(ref1, {
      friendRequests: arrayRemove(datas),
    });
  };
  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <ImageBackground
        source={{ uri: profileData["image"] }}
        blurRadius={20}
        className="w-full align-top flex-1"
      >
        <View className="flex flex-col flex-1 ">
          <SafeAreaView>
            <View className="flex flex-row px-5 my-3">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back-outline" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <View
            className="flex-1"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <View className=" bg-white rounded-t-3xl mt-7">
              <View className="mx-auto">
                <View
                  className="p-2 rounded-full bg-white relative bottom-14"
                  style={{ marginBottom: "-10%" }}
                >
                  <Image
                    source={{ uri: profileData.image }}
                    className="w-28 h-28 rounded-full"
                  />
                </View>
              </View>
              <View className="">
                <Text
                  className="text-center font-medium text-gray-900"
                  style={{ fontSize: 32, fontFamily: "font1" }}
                >
                  {profileData.name}
                </Text>
              </View>

              <View className="px-10 pb-5">
                <Text
                  className="text-center text-gray-600"
                  style={{
                    fontSize: 18,

                    fontWeight: "600",
                    fontFamily: "font2",
                  }}
                >
                  {profileData.bio}
                </Text>
              </View>
              <View
                className="p-8 pt-0"
                style={{ display: "flex", flexDirection: "row" }}
              >
                <View className="flex-1">
                  <View className="px-5">
                    {!following ? (
                      <>
                        {followBack ? (
                          <View>
                            <TouchableOpacity
                              onPress={() => acceptRequest()}
                              className="border border-blue-700 rounded-full w-full mx-auto p-4"
                            >
                              <Text className="text-blue-700 text-center">
                                Accept Request
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <>
                            {!requestSent ? (
                              <View>
                                <TouchableOpacity
                                  onPress={() => sendFriendRequest()}
                                  className="bg-blue-700 rounded-full w-full mx-auto p-4"
                                >
                                  <Text className="text-white text-center">
                                    Send Request
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <View>
                                <TouchableOpacity
                                  onPress={() => unsendRequest()}
                                  className="border border-blue-700 rounded-full w-full mx-auto p-4"
                                >
                                  <Text className="text-blue-700 text-center">
                                    Request Sent
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <View>
                          <TouchableOpacity
                            onPress={() => unsendRequest()}
                            className="bg-blue-700 rounded-full w-full mx-auto p-4"
                          >
                            <Text className="text-white text-center">
                              Friends
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </View>

              <View
                className=" mb-5"
                style={{ display: "flex", flexDirection: "row" }}
              >
                <View
                  style={{ flex: 1 }}
                  className="border-r-gray-200 border-r"
                >
                  <View className="flex flex-col">
                    <Text className="text-center font-bold tracking-wider text-2xl">
                      {profileData["following"]
                        ? profileData["following"].length
                        : 0}
                    </Text>
                    <Text
                      className="text-center font-light"
                      style={{ fontSize: 15, fontFamily: "font1" }}
                    >
                      Friends
                    </Text>
                  </View>
                </View>
                <View
                  style={{ flex: 1 }}
                  className="border-r-gray-200 border-r"
                >
                  <View className="flex flex-col">
                    <Text className="text-center font-bold tracking-wider text-2xl">
                      120
                    </Text>
                    <Text
                      className="text-center font-light"
                      style={{ fontSize: 15, fontFamily: "font1" }}
                    >
                      Community
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <View className="flex flex-col">
                    <Text className="text-center font-bold tracking-wider text-2xl">
                      {profileData["challengeList"]
                        ? profileData["challengeList"].length
                        : 0}
                    </Text>
                    <Text
                      className="text-center font-light"
                      style={{ fontSize: 15, fontFamily: "font1" }}
                    >
                      Challenges
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {following ? (
              <>
                <View className="bg-white flex-1 flex flex-col">
                  <View className="">
                    <View className="bg-gray-200 p-1"></View>
                  </View>
                  <View className=" bg-white p-4 flex flex-row">
                    <Text className="text-2xl font-extrabold tracking-tighter my-auto">
                      Groups
                    </Text>
                  </View>
                  <View className="bg-white px-1 pb-5">
                    <ScrollView
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                    >
                      {groupData.map((data) => {
                        return (
                          <InlistedGroups data={data} navigation={navigation} />
                        );
                      })}
                    </ScrollView>
                  </View>
                  {goalData.length != 0 ? (
                    <>
                      <View className="">
                        <View className="bg-gray-200 p-1"></View>
                      </View>
                      <View className=" bg-white p-4 flex flex-row">
                        <Text className="text-2xl font-extrabold tracking-tighter my-auto">
                          Challenges
                        </Text>
                      </View>
                      <View className="bg-white px-4 pb-5 ">
                        <ScrollView
                          showsHorizontalScrollIndicator={false}
                          horizontal={true}
                        >
                          {goalData.map((data) => {
                            return (
                              <InlistedGoals
                                data={data}
                                navigation={navigation}
                              />
                            );
                          })}
                        </ScrollView>
                      </View>
                    </>
                  ) : (
                    <></>
                  )}
                </View>
              </>
            ) : (
              <View className="bg-white p-4 flex-1 flex flex-col">
                <View className="my-auto">
                  <View className="mx-auto">
                    <Icon
                      name="lock-closed-outline"
                      color={"#afafaf"}
                      size={50}
                    />
                  </View>
                  <Text className="text-center text-xl mt-5 text-gray-600 font-light tracking">
                    Private Account
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default VisitProfile;
