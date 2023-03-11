import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchProfile from "../../screens/community/SearchProfile";
import Profile from "../../screens/profile/Profile";
const Stack = createNativeStackNavigator();
const ProfileRouter = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="SearchProfile" component={SearchProfile} />
    </Stack.Navigator>
  );
};

export default ProfileRouter;
