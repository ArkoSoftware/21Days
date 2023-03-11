import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Switch,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useFonts } from "expo-font";

import { auth, storage, db } from "../../security/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/Loading";

const InputField = ({ label, value, placeholder, changeState }) => {
  return (
    <View className="flex flex-col">
      <Text className="text-gray-600" style={{ fontSize: 12, paddingLeft: 5 }}>
        {label}
      </Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={(txt) => changeState(txt)}
        className="border-b border-b-gray-400 p-2 pt-0"
      />
    </View>
  );
};

const EditProfile = ({ navigation }) => {
  const [fullName, setName] = useState(auth.currentUser.displayName);
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(auth.currentUser.photoURL);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPreviousData = async () => {
    const d2 = await AsyncStorage.getItem("bio");
    const d3 = await AsyncStorage.getItem("public");
    setBio(d2);
    setIsEnabled(d3 == "true" ? true : false);
  };
  useEffect(() => {
    getPreviousData();
  }, []);

  const name = auth.currentUser.displayName;
  const [fontsLoaded] = useFonts({
    font1: require("../../../assets/fonts/Overpass-VariableFont_wght.ttf"),
    font2: require("../../../assets/fonts/HindMadurai-Medium.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {}, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const updateData = async () => {
    setLoading(true);
    const ref1 = doc(db, "user", auth.currentUser.uid);
    await setDoc(
      ref1,
      { name: fullName, bio: bio, public: isEnabled },
      { merge: true }
    );
    await updateProfile(auth.currentUser, {
      displayName: fullName,
    });

    await AsyncStorage.setItem("bio", bio);
    await AsyncStorage.setItem("name", fullName);
    await AsyncStorage.setItem("public", JSON.stringify(isEnabled));

    setLoading(false);
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result["assets"][0]["uri"]);
      setLoading(true);
      const ref2 = doc(db, "user", auth.currentUser.uid);

      const storageRef = ref(storage, "profile/" + auth.currentUser.uid);
      const val = await fetch(result["assets"][0]["uri"]);
      const imageBlob = await val.blob();
      uploadBytes(storageRef, imageBlob).then((snapshot) => {
        getDownloadURL(storageRef).then(async (url) => {
          const snap = await setDoc(ref2, { image: url }, { merge: true });
          await AsyncStorage.setItem("profileImage", url);

          await updateProfile(auth.currentUser, {
            photoURL: url,
          });
        });
      });
    } else {
      alert("You did not select any image.");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {!loading ? (
        <>
          <View className="p-4 flex flex-row">
            <Icon
              onPress={() => navigation.goBack()}
              name="chevron-back"
              size={24}
              color="#000"
            />
            <Text className="text-xl font-bold tracking-widest my-auto mx-6">
              Edit Profile
            </Text>
          </View>
          <View className="border-b border-b-gray-200 py-6">
            <View className="mx-auto">
              <Image
                source={{ uri: image }}
                className="h-20 w-20 rounded-full"
              />
              <TouchableOpacity
                onPress={() => pickImageAsync()}
                className="bg-white p-1 absolute rounded-full border bottom-0 right-0"
                style={{ alignSelf: "flex-start" }}
              >
                <Icon name="image-outline" size={20} />
              </TouchableOpacity>
            </View>
            <Text
              className="text-center font-medium text-gray-900 my-3s"
              style={{ fontSize: 22, fontFamily: "font1" }}
            >
              {name}
            </Text>
          </View>
          <View className="flex flex-col px-3 py-2 pt-8">
            <View>
              <InputField
                label="Name"
                value={fullName}
                placeholder="Name"
                changeState={setName}
              />
            </View>
            <View className="mt-5">
              <InputField
                label="Bio"
                value={bio}
                placeholder="Bio"
                changeState={setBio}
              />
            </View>
            <View className="mt-5 ">
              <Text
                className="text-gray-600"
                style={{ fontSize: 12, paddingLeft: 5 }}
              >
                Public
              </Text>
              <Switch
                trackColor={{ false: "#ADADAD", true: "#B17FF7" }}
                thumbColor={isEnabled ? "#6200EE" : "#fff"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setIsEnabled(!isEnabled)}
                value={isEnabled}
                className="mr-auto"
                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => updateData()}
            activeOpacity={0.9}
            className="m-3 rounded-xl p-4 mt-auto bg-blue-800"
          >
            <Text className="text-center text-white">Update Profile</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Loading />
      )}
    </SafeAreaView>
  );
};

export default EditProfile;
