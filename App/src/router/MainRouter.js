import React, { useEffect } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import CommunityRouter from "./main/CommunityRouter";
import Icon from "react-native-vector-icons/Ionicons";
import ChatRouter from "./main/ChatRouter";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VisitProfile from "../screens/profile/VisitProfile";
import ProfileRouter from "./main/ProfileRouter";
import Post from "../screens/community/Post";
import InformationRouter from "./InformationRouter";
import ChallengeRouter from "./main/ChallengeRouter";
import Search from "../screens/search/Search";
import Chat from "../screens/chat/Chat";
import CreateGroup from "../screens/group/CreateGroup";
import GroupRouter from "./main/GroupRouter";
import Notification from "../screens/notification/Notification";
import * as Notifications from "expo-notifications";
import { useNotification } from "../notification/useNotification";
import GoalSetting from "../screens/community/component/GoalSetting";
import JoinRequest from "../screens/community/component/JoinRequest";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const TabRouter = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          elevation: 0,
          borderTopWidth: 0,
          padding: 10,
          paddingTop: 0,
          paddingHorizontal: 20,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              className={
                !focused ? "p-2 border-t-2 border-white " : "p-2 border-t-2"
              }
            >
              <Icon
                name={!focused ? "ribbon-outline" : "ribbon"}
                color="#3e3e3e"
                size={24}
              />
            </View>
          ),
        }}
        name="ChallengeRouter"
        component={ChallengeRouter}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              className={
                !focused ? "p-2 border-t-2 border-white " : "p-2 border-t-2"
              }
            >
              <Icon
                name={!focused ? "earth-outline" : "earth"}
                color="#3e3e3e"
                size={24}
              />
            </View>
          ),
        }}
        name="CommunityRouter"
        component={CommunityRouter}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              className={
                !focused ? "p-2 border-t-2 border-white " : "p-2 border-t-2"
              }
            >
              <Icon
                name={!focused ? "person-outline" : "person"}
                color="#3e3e3e"
                size={24}
              />
            </View>
          ),
        }}
        name="ProfileRouter"
        component={ProfileRouter}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              className={
                !focused ? "p-2 border-t-2 border-white " : "p-2 border-t-2"
              }
            >
              <Icon
                name={!focused ? "chatbubble-outline" : "chatbubble"}
                color="#3e3e3e"
                size={24}
              />
            </View>
          ),
        }}
        name="InboxRouter"
        component={ChatRouter}
      />
    </Tab.Navigator>
  );
};
const MainRouter = () => {
  const { registerForPushNotificationsAsync, handleNotificationResponse } =
    useNotification();
  useEffect(() => {
    registerForPushNotificationsAsync();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    const responseListener = Notifications.addNotificationReceivedListener(
      handleNotificationResponse
    );
    return () => {
      if (responseListener)
        Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainStack" component={TabRouter} />
        <Stack.Screen name="VisitProfile" component={VisitProfile} />
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen name="InformationRouter" component={InformationRouter} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
        <Stack.Screen name="GroupRouter" component={GroupRouter} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="GoalSetting" component={GoalSetting} />
        <Stack.Screen name="JoinRequestGoal" component={JoinRequest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainRouter;
