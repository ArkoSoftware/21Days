import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { auth, db } from "../../security/firebase";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore/lite";
import InlistedGroups from "./components/InlistedGroups";
import InlistedGoals from "./components/InlistedGoals";
const Profile = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [reload, setReload] = useState(false);
  const [userData, setUserData] = useState({});
  const [bio, setBio] = useState("");
  const [groupData, setGroupData] = useState([]);
  const [goalData, setGoalData] = useState([]);
  useEffect(() => {
    changeStateValue();
    getGroupData();
    getGoalData();
    getUserData();
  }, [reload]);
  const getUserData = async () => {
    const doc1 = doc(db, "user", auth.currentUser.uid);
    const snap = await getDoc(doc1);
    setUserData(snap.data());
  };
  const getGoalData = async () => {
    const ref1 = collection(db, "challenges");
    const q = query(ref1, where("user", "==", auth.currentUser.uid));
    const snap = await getDocs(q);
    const arr = [];
    snap.forEach((data) => {
      arr.push([data.id, data.data()]);
    });
    setGoalData(arr);
  };

  const getGroupData = async () => {
    const ref1 = collection(db, "group");
    const q = query(ref1, where("user", "==", auth.currentUser.uid));
    const snap = await getDocs(q);
    const arr = [];
    snap.forEach((data) => {
      arr.push([data.id, data.data()]);
    });
    setGroupData(arr);
  };
  const changeStateValue = async () => {
    const d2 = await AsyncStorage.getItem("bio");
    setBio(d2);
  };

  const name = auth.currentUser.displayName;
  const photo = auth.currentUser.photoURL;
  const [fontsLoaded] = useFonts({
    font1: require("../../../assets/fonts/Overpass-VariableFont_wght.ttf"),
    font2: require("../../../assets/fonts/HindMadurai-Medium.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {}, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setReload(!reload);
          }}
        />
      }
    >
      <ImageBackground
        source={{ uri: photo }}
        blurRadius={20}
        className="w-full align-top flex-1"
      >
        <View className="flex flex-col flex-1 ">
          <SafeAreaView>
            <View className="flex flex-row px-5 my-3">
              <TouchableOpacity
                onPress={() => navigation.navigate("InformationRouter")}
                className="ml-auto"
              >
                <Icon
                  name="ellipsis-horizontal-outline"
                  size={25}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <View style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <View
              style={{ flex: 1 }}
              className=" bg-white rounded-t-3xl mt-7 pb-7"
            >
              <View className="mx-auto">
                <View
                  className="p-2 rounded-full bg-white relative bottom-14"
                  style={{ marginBottom: "-10%" }}
                >
                  <Image
                    source={{ uri: photo }}
                    className="w-28 h-28 rounded-full"
                  />
                </View>
              </View>
              <View className="">
                <Text
                  className="text-center font-medium text-gray-900"
                  style={{ fontSize: 32, fontFamily: "font1" }}
                >
                  {name}
                </Text>
              </View>

              <View className=" flex-1 px-10 ">
                <Text
                  className="text-center text-gray-600"
                  style={{
                    fontSize: 18,

                    fontWeight: "600",
                    fontFamily: "font2",
                  }}
                >
                  {bio}
                </Text>
              </View>

              <View
                className="flex-1 mt-5 "
                style={{ display: "flex", flexDirection: "row" }}
              >
                <View
                  style={{ flex: 1 }}
                  className="border-r-gray-200 border-r"
                >
                  <View className="flex flex-col">
                    <Text className="text-center font-bold tracking-wider text-2xl">
                      {userData["following"] ? userData["following"].length : 0}
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
                      {userData["challengeList"]
                        ? userData["challengeList"].length
                        : 0}
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
                      {userData["challengeList"]
                        ? userData["challengeList"].length
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

            <View className="">
              <View className="bg-gray-200 p-1"></View>
            </View>
            <View className=" bg-white p-3 flex flex-row" style={{ flex: 1 }}>
              <Text className="text-2xl font-extrabold tracking-tighter my-auto">
                Groups
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate("CreateGroup")}
                className="bg-pink-700 rounded-xl flex flex-row p-2 ml-auto"
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
            <View className="bg-white px-1 pb-5">
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              >
                {groupData.map((data) => {
                  return <InlistedGroups data={data} navigation={navigation} />;
                })}
              </ScrollView>
            </View>
            {goalData.length != 0 ? (
              <>
                <View className="">
                  <View className="bg-gray-200 p-1"></View>
                </View>
                <View
                  className=" bg-white p-3 flex flex-row"
                  style={{ flex: 1 }}
                >
                  <Text className="text-2xl font-extrabold tracking-tighter my-auto">
                    Challenges
                  </Text>
                </View>
                <View className="bg-white px-1 pb-5">
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                  >
                    {goalData.map((data) => {
                      return (
                        <InlistedGoals data={data} navigation={navigation} />
                      );
                    })}
                  </ScrollView>
                </View>
              </>
            ) : (
              <></>
            )}
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default Profile;
