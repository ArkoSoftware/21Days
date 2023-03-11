import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore/lite";
import { db, storage, auth } from "../../../security/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Loading from "../../../components/Loading";

const CreateGroup = ({ route, navigation }) => {
  const data = route.params["data"];
  const [backgroundImage, setBackgroundImage] = useState(
    data[1].backgroundImage
  );
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(data[1].name);
  const [description, setDescription] = useState(data[1].description);
  const [frontImage, setFrontImage] = useState(data[1].frontImage);
  const [isEnabled, setIsEnabled] = useState(data[1].private);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const pickImageAsync1 = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setBackgroundImage(result["assets"][0]["uri"]);
    } else {
    }
  };
  const pickImageAsync2 = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setFrontImage(result["assets"][0]["uri"]);
    } else {
    }
  };

  const UploadData = async () => {
    setLoading(true);
    var desiredMaxLength = 24;
    var randomNumber = "";
    for (var i = 0; i < desiredMaxLength; i++) {
      randomNumber += Math.floor(Math.random() * 10);
    }
    const ref1 = doc(db, "group", data[0]);
    const storageRef = ref(storage, "groupImage/" + randomNumber);
    randomNumber = "";
    for (var i = 0; i < desiredMaxLength; i++) {
      randomNumber += Math.floor(Math.random() * 10);
    }
    const storageRef2 = ref(storage, "groupImage/" + randomNumber);

    const val = await fetch(backgroundImage);
    const imageBlob = await val.blob();
    const val2 = await fetch(frontImage);
    const imageBlob2 = await val2.blob();
    uploadBytes(storageRef, imageBlob).then((snapshot) => {
      getDownloadURL(storageRef).then(async (url) => {
        uploadBytes(storageRef2, imageBlob2).then((snapshot) => {
          getDownloadURL(storageRef2).then(async (url2) => {
            await updateDoc(ref1, {
              name: name,
              description: description,
              timeStamp: serverTimestamp(),
              private: isEnabled,
              lastUpdate: serverTimestamp(),
              user: auth.currentUser.uid,
              userName: auth.currentUser.displayName,
              followers: 0,
              posts: 0,
              backgroundImage: url,
              frontImage: url2,
            }).then(() => {
              setLoading(false);
              navigation.navigate("GroupPage", { item });
            });
          });
        });
      });
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {loading ? (
        <Loading />
      ) : (
        <ScrollView className="flex-1 h-full">
          <View className="p-4 flex flex-row">
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.goBack()}
            >
              <Icon
                name="chevron-back"
                color={"#2f2f2f"}
                size={24}
                style={{ marginTop: "auto", marginBottom: "auto" }}
              />
            </TouchableOpacity>
            <Text className="font-bold text-2xl my-auto ml-5">
              Create Group
            </Text>
          </View>
          <View className="my-4">
            <View className="px-4 mb-7">
              <ImageBackground
                imageStyle={{ borderRadius: 20 }}
                source={{
                  uri: backgroundImage,
                }}
                className="h-48 w-full bg-gray-500 rounded-3xl"
              >
                <TouchableOpacity
                  onPress={() => pickImageAsync1()}
                  activeOpacity={0.9}
                  className="bg-white p-3 m-4 ml-auto rounded-xl border-2 border-black"
                  style={{ alignSelf: "flex-start" }}
                >
                  <Icon name="pencil-outline" size={16} color={"#2f2f2f"} />
                </TouchableOpacity>
                <View
                  className="p-1 rounded-full mx-auto bg-gray-600"
                  style={{ alignSelf: "flex-start" }}
                >
                  <Image
                    source={{
                      uri: frontImage,
                    }}
                    className="w-24 h-24 rounded-full"
                  />
                  <TouchableOpacity
                    onPress={() => pickImageAsync2()}
                    activeOpacity={0.9}
                    className="bg-black p-2 ml-auto rounded-xl absolute border-2 border-white bottom-0 right-0"
                    style={{ alignSelf: "flex-start" }}
                  >
                    <Icon name="pencil-outline" size={16} color={"#fff"} />
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
            <View className="px-4 space-y-2">
              <Text style={{ fontSize: 12 }} className="font-light ml-2">
                Group Name
              </Text>
              <TextInput
                placeholder="Eg. XYZ Workout Group"
                className="bg-gray-100 rounded-xl p-2 px-4"
                style={{ fontSize: 12 }}
                value={name}
                onChangeText={(txt) => setName(txt)}
              />
            </View>
            <View className="px-4 space-y-2 mt-5">
              <Text style={{ fontSize: 12 }} className="font-light ml-2">
                Group Description
              </Text>
              <TextInput
                multiline
                numberOfLines={10}
                textAlignVertical="top"
                placeholder="Eg. This group is for workout"
                className="bg-gray-100 rounded-xl p-2 px-4"
                style={{ fontSize: 12 }}
                value={description}
                onChangeText={(txt) => setDescription(txt)}
              />
            </View>
            <View className="px-4 mt-5 flex flex-col">
              <Text style={{ fontSize: 12 }} className="font-light ml-2">
                Private
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                className="mr-auto"
              />
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => UploadData()}
            className="p-4 rounded-xl bg-blue-700 mx-3 mt-auto mb-8"
          >
            <Text className="text-center text-white">Update Group</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default CreateGroup;
