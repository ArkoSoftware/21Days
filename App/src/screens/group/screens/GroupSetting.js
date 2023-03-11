import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useFonts } from "expo-font";
import { signOut } from "firebase/auth";
import { auth } from "../../../security/firebase";
const GroupSetting = ({ navigation }) => {
  const image = auth.currentUser.photoURL;
  const name = auth.currentUser.displayName;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 flex flex-row">
        <Icon
          onPress={() => navigation.goBack()}
          name="chevron-back"
          size={24}
          color="#000"
        />
        <Text className="text-xl font-bold tracking-widest my-auto mx-6">
          Group Settings
        </Text>
      </View>

      <ScrollView className=" py-4">
        <TouchableOpacity
          onPress={() => navigation.navigate("EditGroup")}
          className="flex flex-row p-4 py-3 "
        >
          <Icon name="create-outline" size={25} color="#2f2f2f" />
          <Text className="text-base my-auto mx-3">Edit Group</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("MemberManagement")}
          className="flex flex-row p-4 py-3 "
        >
          <Icon name="people-outline" size={25} color="#2f2f2f" />
          <Text className="text-base my-auto mx-3">Member Management</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row p-4 py-3 ">
          <Icon name="notifications-outline" size={25} color="#2f2f2f" />
          <Text className="text-base my-auto mx-3">
            Notification Preferences
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GroupSetting;
