import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";

const InlistedGroups = ({ data, navigation }) => {
  const d1 = data[1];
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("GroupRouter", { data: data })}
    >
      <ImageBackground
        imageStyle={{ borderRadius: 10, resizeMode: "cover" }}
        source={{
          uri: d1.backgroundImage,
        }}
        className="w-44 h-28 rounded-xl mx-2"
      >
        <View
          className="bg-white p-1 rounded-full mx-auto mt-auto  mb-3"
          style={{ alignSelf: "flex-start" }}
        >
          <Image
            source={{
              uri: d1.frontImage,
            }}
            className="w-12 h-12 rounded-full"
          />
        </View>
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
      <Text className="font-bold mx-3 mt-2 tracking-tighter">{d1.name}</Text>
      <View
        className="flex flex-row px-3 mt-1"
        style={{ alignSelf: "flex-start" }}
      >
        <Icon name="clipboard-outline" size={12} color="#6f6f6f" />
        <Text
          style={{ fontSize: 12 }}
          className="font-light text-gray-500 tracking-tighter ml-2 "
        >
          {d1.posts}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default InlistedGroups;
