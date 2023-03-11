import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Linking, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { arrayUnion, doc, updateDoc } from "firebase/firestore/lite";
import { auth, db } from "../security/firebase";
export const useNotification = () => {
  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      let getToken = await AsyncStorage.getItem("notificationToken");
      if (getToken == null || getToken == "") {
        console.log(auth.currentUser.uid);

        const doc1 = doc(db, "user", auth.currentUser.uid);
        const snap = await updateDoc(doc1, {
          notificationId: arrayUnion(token),
        });
        console.log("WOrking");
        await AsyncStorage.setItem("notificationToken", token);
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };

  const handleNotificationResponse = (response) => {
    const data = response.request.content.data;
    if (data?.url) Linking.openURL(data.url);
  };

  return {
    registerForPushNotificationsAsync,
    handleNotificationResponse,
  };
};
