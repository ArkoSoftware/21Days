import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const SavedChallenges = ({ item, navigation }) => {
  const ago = item[1].startDate.seconds - new Date().getTime() / 1000;
  const duration = parseInt(
    (item[1].endDate.seconds - item[1].startDate.seconds) / 86400
  );
  const diff = parseInt(ago / 86400);
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Post", item)}
      className=" rounded-xl w-72 mr-4"
      style={{ backgroundColor: "#CEEBFF" }}
    >
      <View className="flex flex-row">
        <View className="flex flex-col flex-1 p-5 px-5 pr-10 ">
          <Text className="font-bold text-2xl tracking-tighter">
            {item[1].taskTitle}
          </Text>
          <Text className="font-light text2xl tracking-tighter">
            Duration: {duration} days
          </Text>
        </View>
        <Image
          source={{
            uri: item[1].image,
          }}
          className="w-10 h-10 rounded-full ml-auto m-3"
        />
      </View>

      <View className=" flex flex-row p-5 px-5">
        <Text className="text-base font-light tracking-tighter">
          {diff == 0 ? <>Active</> : <>{diff} days to go...</>}
        </Text>
        <Image
          source={{
            uri: "https://s26552.pcdn.co/wp-content/uploads/2022/09/dc_neighborhood_news-7.jpg",
          }}
          className="w-5 h-5 rounded-full ml-auto"
        />
      </View>
    </TouchableOpacity>
  );
};

export default SavedChallenges;
