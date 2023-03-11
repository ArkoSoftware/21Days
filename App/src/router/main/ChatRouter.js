import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatList from "../../screens/chat/ChatList";
import SearchChat from "../../screens/chat/SearchChat";
const Stack = createNativeStackNavigator();
const ChatRouter = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Chatlist" component={ChatList} />
      <Stack.Screen name="SearchChat" component={SearchChat} />
    </Stack.Navigator>
  );
};

export default ChatRouter;
