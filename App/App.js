import React, { useEffect, useState } from "react";
import AuthCheck from "./src/router/AuthCheck";
import { LogBox } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Network from "expo-network";
import { db, auth } from "./src/security/firebase";
import { doc, getDoc } from "firebase/firestore/lite";
import AsyncStorage from "@react-native-async-storage/async-storage";
SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      if (auth) {
        try {
          const status = await Network.getNetworkStateAsync();
          if (status.isInternetReachable) {
            const ref1 = doc(db, "user", auth.currentUser.uid);
            const snap = await getDoc(ref1);
            const data = snap.data();
            await AsyncStorage.setItem("address", data.address || "");
            await AsyncStorage.setItem("bio", data.bio || "");
            await AsyncStorage.setItem("gender", data.gender || "");
            await AsyncStorage.setItem("profileImage", data.image || "");
            await AsyncStorage.setItem("name", data.name || "");
            await AsyncStorage.setItem("website", data.website || "");
          }
        } catch (e) {
          console.warn(e);
        } finally {
          setAppIsReady(true);
          await SplashScreen.hideAsync();
        }
      }
    }
    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }
  LogBox.ignoreAllLogs();
  return <AuthCheck />;
};

export default App;
