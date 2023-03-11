import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GoalSetting from "../../screens/community/component/GoalSetting";

const Stack = createNativeStackNavigator();

const GoalSettingRouter = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GoalSetting" component={GoalSetting} />
    </Stack.Navigator>
  );
};

export default GoalSettingRouter;
