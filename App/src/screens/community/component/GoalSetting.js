import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import UpdateGoal from "../../../components/CreateChallenge/UpdateGoal";

const GoalSetting = ({ navigation, route }) => {
  const [open, setOpen] = useState(false);
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
        <Text className="my-auto text-xl font-medium">Goal Setting</Text>
      </View>
      <View className="flex flex-col">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("JoinRequestGoal", { id: route.params["id"] })
          }
          className="flex flex-row space-x-4 border-b border-gray-100 py-4 px-5"
        >
          <Icon name="person-add-outline" size={24} />
          <Text className="my-auto">Join Request</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row space-x-4 border-b border-gray-100 py-4 px-5">
          <Icon name="construct-outline" size={24} />
          <Text className="my-auto">Manage Members</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setOpen(!open)}
          className="flex flex-row space-x-4 border-b border-gray-100 py-4 px-5"
        >
          <Icon name="create-outline" size={24} />
          <Text className="my-auto">Edit Challenge</Text>
        </TouchableOpacity>
      </View>
      <UpdateGoal
        item={route.params.data}
        open={open}
        setOpen={setOpen}
        isGroup={false}
      />
    </SafeAreaView>
  );
};

export default GoalSetting;
