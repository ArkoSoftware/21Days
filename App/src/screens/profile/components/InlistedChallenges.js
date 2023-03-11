import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
const InlistedChallenges = ({ data, navigation }) => {
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
          className="flex flex-row px-2 mt-1 bg-white rounded py-1 absolute top-1 right-3"
          style={{ alignSelf: "flex-start" }}
        >
          <Icon name="people-outline" size={12} color="#000" />
          <Text
            style={{ fontSize: 12 }}
            className="font-light text-gray-800 tracking-tighter ml-2 "
          >
            {d1.followers}
          </Text>
        </View>
      </ImageBackground>
      <Text className="font-bold mx-3 mt-2 tracking-tighter">{d1.title}</Text>
    </TouchableOpacity>
  );
};

export default InlistedChallenges;
