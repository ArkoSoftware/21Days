import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";

const InlistedGoals = ({ data, navigation }) => {
  const d1 = data[1];
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("Post", data)}
    >
      <ImageBackground
        imageStyle={{ borderRadius: 10, resizeMode: "cover" }}
        source={{
          uri: d1.image,
        }}
        className="w-44 h-28 rounded-xl mx-2"
      >
        <View
          className="flex flex-row px-2 mt-1 bg-black rounded py-1 absolute top-1 right-3"
          style={{ alignSelf: "flex-start" }}
        >
          <Icon name="people-outline" size={12} color="#fff" />
          <Text
            style={{ fontSize: 12 }}
            className="font-light text-white tracking-tighter ml-2 "
          >
            {d1.followers}
          </Text>
        </View>
      </ImageBackground>
      <Text className="font-bold mx-3 mt-2 tracking-tighter">
        {d1.taskTitle}
      </Text>
      {d1.habit ? (
        <View
          className="flex flex-row px-2 mt-1 bg-orange-500 rounded py-1"
          style={{ alignSelf: "flex-start" }}
        >
          <Text
            style={{ fontSize: 12 }}
            className="font-light text-white tracking-tighter ml-3 "
          >
            Habit
          </Text>
        </View>
      ) : (
        <View
          className="flex flex-row px-2 mt-1 bg-green-600 rounded py-1 ml-3"
          style={{ alignSelf: "flex-start" }}
        >
          <Text
            style={{ fontSize: 12 }}
            className="font-light text-white tracking-tighter "
          >
            Goal
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default InlistedGoals;
