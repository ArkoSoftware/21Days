import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
import React, { useState, useEffect } from "react";
import { View, Switch, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "../../security/firebase";

const Notification = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(true);

  const toggleSwitch = async () => {
    const doc1 = doc(db, "user", auth.currentUser.uid);
    const snap = await updateDoc(doc1, { notification: !isEnabled });
    setIsEnabled((previousState) => !previousState);
  };
  const getAllData = async () => {
    const doc1 = doc(db, "user", auth.currentUser.uid);
    const snap = await getDoc(doc1);
    if (snap.data.notification) {
      setIsEnabled(snap.data.notification);
    } else {
      const snap2 = await updateDoc(doc1, { notification: true });
    }
  };
  useEffect(() => {
    console.log("hi");
    getAllData();
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="p-4 flex flex-row">
        <Icon
          onPress={() => navigation.goBack()}
          name="chevron-back"
          size={24}
          color="#000"
        />
        <Text className="text-xl font-bold tracking-widest my-auto mx-6">
          Notification Preferences
        </Text>
      </View>
      <View className=" border-b border-b-gray-100 py-2 flex flex-row">
        <Text className="text-sm font-light my-auto ml-4">
          General Notification:
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#4a90e2" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          // Change the color of the Switch here
          thumbTintColor="#f5a442"
          trackTintColor="#aaa"
          className="ml-auto my-auto mr-5"
        />
      </View>
      <View className=" border-b border-b-gray-100 py-2 flex flex-row">
        <Text className="text-sm font-light my-auto ml-4">
          Community Notification:
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#4a90e2" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          // Change the color of the Switch here
          thumbTintColor="#f5a442"
          trackTintColor="#aaa"
          className="ml-auto my-auto mr-5"
        />
      </View>
      <View className=" border-b border-b-gray-100 py-2 flex flex-row">
        <Text className="text-sm font-light my-auto ml-4">
          Habit/ Goal Notification:
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#4a90e2" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          // Change the color of the Switch here
          thumbTintColor="#f5a442"
          trackTintColor="#aaa"
          className="ml-auto my-auto mr-5"
        />
      </View>
      <View className=" border-b border-b-gray-100 py-2 flex flex-row">
        <Text className="text-sm font-light my-auto ml-4">
          Friend Notification:
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#4a90e2" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          // Change the color of the Switch here
          thumbTintColor="#f5a442"
          trackTintColor="#aaa"
          className="ml-auto my-auto mr-5"
        />
      </View>
    </SafeAreaView>
  );
};

export default Notification;
