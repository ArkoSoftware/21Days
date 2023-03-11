import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfile from "../screens/profile/EditProfile";
import InformationPage from "../screens/profile/InformationPage";
import Notification from "../screens/profile/Notification";
const Stack = createNativeStackNavigator();
const InformationRouter = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InformationPage" component={InformationPage} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Notification" component={Notification} />
    </Stack.Navigator>
  );
};

export default InformationRouter;
