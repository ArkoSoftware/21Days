import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GroupPage from "../../screens/group/GroupPage";
import GroupSetting from "../../screens/group/screens/GroupSetting";
import EditGroup from "../../screens/group/screens/EditGroup";
import MemberManagement from "../../screens/group/screens/MemberManagement";
const Stack = createNativeStackNavigator();
const GroupRouter = ({ route }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="GroupPage"
        component={GroupPage}
        initialParams={route.params}
      />
      <Stack.Screen
        name="GroupSetting"
        component={GroupSetting}
        initialParams={route.params}
      />
      <Stack.Screen
        name="EditGroup"
        component={EditGroup}
        initialParams={route.params}
      />
      <Stack.Screen
        name="MemberManagement"
        component={MemberManagement}
        initialParams={route.params}
      />
    </Stack.Navigator>
  );
};

export default GroupRouter;
