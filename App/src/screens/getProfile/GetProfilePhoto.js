import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Neutral from "../../../assets/image/upload.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, storage, db } from "../../security/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore/lite";
import { updateCurrentUser, updateProfile } from "firebase/auth";
import Loading from "../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MAIN_COLOR } from "../../color";

const GetProfilePhoto = ({ refresh }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const SubmitForm = async () => {
    setLoading(true);
    const ref2 = doc(db, "user", auth.currentUser.uid);

    const storageRef = ref(storage, "profile/" + auth.currentUser.uid);
    const val = await fetch(image);
    const imageBlob = await val.blob();
    uploadBytes(storageRef, imageBlob).then((snapshot) => {
      getDownloadURL(storageRef).then(async (url) => {
        const snap = await setDoc(
          ref2,
          { image: url, public: false },
          { merge: true }
        );
        await updateProfile(auth.currentUser, {
          photoURL: url,
        });
        await AsyncStorage.setItem("public", JSON.stringify(false));
        refresh();
      });
    });

    /*
    
    */
    //refresh();
  };
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result["assets"][0]["uri"]);
    } else {
      alert("You did not select any image.");
    }
  };
  if (loading) {
    return <Loading />;
  } else {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="text-center m-16 font-extrabold text-5xl text-gray-700">
          Select Profile Image
        </Text>
        {image == null ? (
          <TouchableOpacity
            onPress={() => pickImageAsync()}
            activeOpacity={0.8}
            className="p-3 h-48 w-48 my-auto mx-auto border border-pink-700 rounded-2xl "
          >
            <Image
              source={Neutral}
              className="w-16 h-16 my-auto mx-auto rounded-full"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => pickImageAsync()}
            activeOpacity={0.8}
            className="p-6  my-auto mx-auto border border-blue-700 rounded-2xl "
          >
            <Image
              source={{ uri: image }}
              className="w-48 h-48 my-auto mx-auto rounded-3xl"
            />
          </TouchableOpacity>
        )}
        <View className="mt-auto">
          <TouchableOpacity
            style={{ backgroundColor: MAIN_COLOR }}
            activeOpacity={0.9}
            onPress={() => SubmitForm()}
            className="bg-blue-700 p-5 rounded-xl m-8"
          >
            <Text
              className="text-center tracking-widest text-white my-auto "
              style={{ fontSize: 14 }}
            >
              CONTINUE
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
};

export default GetProfilePhoto;
