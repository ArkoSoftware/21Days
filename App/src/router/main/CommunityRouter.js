import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Feed from "../../screens/community/Feed";
import SearchProfile from "../../screens/community/SearchProfile";
import SearchChat from "../../screens/chat/SearchChat";
import Post from "../../screens/community/Post";
const Stack = createNativeStackNavigator();
const CommunityRouter = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Feed" component={Feed} />
      <Stack.Screen name="SearchProfile" component={SearchProfile} />
      <Stack.Screen name="SearchChat" component={SearchChat} />
    </Stack.Navigator>
  );
};

export default CommunityRouter;
