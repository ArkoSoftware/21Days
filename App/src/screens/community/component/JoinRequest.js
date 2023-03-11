import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  allowGroupEntry,
  getAllJoinRequestData,
} from "../functions/JoinChallenge";
import { auth } from "../../../security/firebase";
const JoinRequest = ({ navigation, route }) => {
  const [requestData, setRequestData] = useState([]);
  const [rerender, setRerender] = useState(false);
  const getAllData = async () => {
    const response = await getAllJoinRequestData(route.params.id);
    setRequestData(response);
  };
  useEffect(() => {
    getAllData();
  }, [rerender]);
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
      const years = Math.round(elapsedMs / MS_PER_YEAR);
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex flex-row mb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="ml-3 mt-1 rounded-full bg-white w-10 h-10"
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
        <Text className="my-auto text-xl font-medium">Join Request</Text>
      </View>
      <View className="flex flex-col px-5">
        {requestData.map((docs) => {
          return (
            <View className="bg-gray-200 p-4 rounded-xl my-1 flex flex-row">
              <Image
                source={{ uri: docs[2].image }}
                className="w-10 h-10 rounded-full"
              />
              <View className="flex flex-col">
                <Text className="ml-4 text-base">{docs[2].name}</Text>
                <Text className="ml-4 text-base">
                  {formatTimeElapsed(docs[1].time)}
                </Text>
              </View>
              <View className="ml-auto flex flex-row space-x-2">
                <TouchableOpacity
                  onPress={() => {
                    allowGroupEntry(
                      route.params.id,
                      docs[0],
                      auth.currentUser.uid
                    );
                    setRerender(!rerender);
                  }}
                  className="bg-green-700 flex- p-3 rounded"
                >
                  <Icon name="checkmark" size={12} color={"#fff"} />
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-700 flex- p-3 rounded">
                  <Icon name="trash" size={12} color={"#fff"} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default JoinRequest;
