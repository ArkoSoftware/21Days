import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Challenge from "../../screens/challenge/Challenge";
import GoalSetting from "../../screens/community/component/GoalSetting";
import GoalSettingRouter from "./GoalSettingRouter";

const Stack = createNativeStackNavigator();

const ChallengeRouter = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Challenge" component={Challenge} />
      <Stack.Screen name="GoalSettingRouter" component={GoalSettingRouter} />
    </Stack.Navigator>
  );
};

export default ChallengeRouter;
