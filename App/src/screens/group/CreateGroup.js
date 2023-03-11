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
import PickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import {
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore/lite";
import { db, storage, auth } from "../../security/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
const categories = [
  { label: "Category 1", value: "category1" },
  { label: "Category 2", value: "category2" },
  { label: "Category 3", value: "category3" },
];

const CreateGroup = ({ navigation }) => {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frontImage, setFrontImage] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [errorField, setErrorField] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

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

  const UploadData = async () => {
    const error = [];
    if (name == "" || name == null) {
      error.push("name");
    }
    if (description == "" || description == null) {
      error.push("description");
    }

    if (backgroundImage == "" || backgroundImage == null) {
      error.push("backgroundImage");
    }
    if (selectedCategory == "" || selectedCategory == null) {
      error.push("selectedCategory");
    }
    setErrorField(error);
    if (error.length == 0) {
      var desiredMaxLength = 24;
      var randomNumber = "";
      for (var i = 0; i < desiredMaxLength; i++) {
        randomNumber += Math.floor(Math.random() * 10);
      }
      const ref1 = collection(db, "group");
      const storageRef = ref(storage, "groupImage/" + randomNumber);
      randomNumber = "";
      for (var i = 0; i < desiredMaxLength; i++) {
        randomNumber += Math.floor(Math.random() * 10);
      }
      const storageRef2 = ref(storage, "groupImage/" + randomNumber);

      const val = await fetch(backgroundImage);
      const imageBlob = await val.blob();
      uploadBytes(storageRef, imageBlob).then((snapshot) => {
        getDownloadURL(storageRef).then(async (url) => {
          getDownloadURL(storageRef2).then(async (url2) => {
            await addDoc(ref1, {
              name: name,
              description: description,
              timeStamp: serverTimestamp(),
              private: isEnabled,
              user: auth.currentUser.uid,
              userName: auth.currentUser.displayName,
              followers: 0,
              posts: 0,
              backgroundImage: url,
              category: selectedCategory,
            }).then(() => {
              navigation.goBack();
            });
          });
        });
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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
            Create Community
          </Text>
        </View>
        <View className="my-4">
          <View className="px-4 mb-7">
            <ImageBackground
              imageStyle={{ borderRadius: 20 }}
              source={{
                uri: backgroundImage,
              }}
              className={
                errorField.includes("backgroundImage")
                  ? "h-48 w-full bg-red-50 border border-red-600 rounded-3xl"
                  : "h-48 w-full bg-gray-500 rounded-3xl"
              }
            >
              <TouchableOpacity
                onPress={() => pickImageAsync1()}
                activeOpacity={0.9}
                className="bg-white p-3 m-4 ml-auto rounded-xl border-2 border-black"
                style={{ alignSelf: "flex-start" }}
              >
                <Icon name="pencil-outline" size={16} color={"#2f2f2f"} />
              </TouchableOpacity>
            </ImageBackground>
          </View>
          <View className="px-4 space-y-2">
            <Text style={{ fontSize: 12 }} className="font-light ml-2">
              Community Name
            </Text>
            <TextInput
              placeholder="Eg. XYZ Workout Community"
              className={
                errorField.includes("name")
                  ? "bg-red-50 rounded-xl p-2 px-4"
                  : "bg-gray-100 rounded-xl p-2 px-4"
              }
              style={{ fontSize: 12 }}
              value={name}
              onChangeText={(txt) => setName(txt)}
            />
          </View>
          <View className="px-4 space-y-2 mt-5">
            <Text style={{ fontSize: 12 }} className="font-light ml-2">
              Category
            </Text>
            <View
              className={
                errorField.includes("selectedCategory")
                  ? "bg-red-50 rounded-xl px-1"
                  : "bg-gray-100 rounded-xl px-1"
              }
            >
              <PickerSelect
                placeholder={{ label: "Select a category...", value: null }}
                onValueChange={(value) => setSelectedCategory(value)}
                items={categories}
                value={selectedCategory}
              />
            </View>
          </View>
          <View className="px-4 space-y-2 mt-5">
            <Text style={{ fontSize: 12 }} className="font-light ml-2">
              Community Description
            </Text>
            <TextInput
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              placeholder="Eg. This community is for workout"
              className={
                errorField.includes("description")
                  ? "bg-red-50 rounded-xl p-2 px-4"
                  : "bg-gray-100 rounded-xl p-2 px-4"
              }
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
          <Text className="text-center text-white">Create Community</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateGroup;
