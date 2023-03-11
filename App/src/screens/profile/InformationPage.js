import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useFonts } from "expo-font";
import { auth } from "../../security/firebase";
import { signOut } from "firebase/auth";
const InformationPage = ({ navigation }) => {
  const image = auth.currentUser.photoURL;
  const name = auth.currentUser.displayName;
  const [fontsLoaded] = useFonts({
    font1: require("../../../assets/fonts/Overpass-VariableFont_wght.ttf"),
    font2: require("../../../assets/fonts/HindMadurai-Medium.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {}, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
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
          Settings
        </Text>
      </View>
      <View className="border-b border-b-gray-100 py-6">
        <Image
          source={{ uri: image }}
          className="h-20 w-20 rounded-full mx-auto"
        />
        <Text
          className="text-center font-medium text-gray-900 my-3s"
          style={{ fontSize: 22, fontFamily: "font1" }}
        >
          {name}
        </Text>
      </View>
      <ScrollView className=" py-4">
        <TouchableOpacity
          onPress={() => navigation.navigate("EditProfile")}
          className="flex flex-row p-4 py-3 "
        >
          <Icon name="create-outline" size={25} color="#2f2f2f" />
          <Text className="text-base my-auto mx-3">Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Notification")}
          className="flex flex-row p-4 py-3 "
        >
          <Icon name="notifications-outline" size={25} color="#2f2f2f" />
          <Text className="text-base my-auto mx-3">
            Notification Preferences
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row p-4 py-3 ">
          <Icon name="flower-outline" size={25} color="#2f2f2f" />
          <Text className="text-base my-auto mx-3">Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row p-4 py-3 ">
          <Icon name="document-text-outline" size={25} color="#2f2f2f" />
          <Text className="text-base my-auto mx-3">Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => signOut(auth)}
          className="flex flex-row p-4 py-3 mt-10 border-t border-t-gray-100"
        >
          <Icon name="log-out-outline" size={25} color="#2f2f2f" />
          <Text className="text-base my-auto mx-3">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InformationPage;
