import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Platform,
  Switch,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import RBSheet from "react-native-raw-bottom-sheet";
import { auth, storage, db } from "../../../security/firebase";
import DropDownCategory from "../../../components/DropDownCategory";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import UnitSelector from "../../../components/UnitSelector";
import FrequencySelector from "../../../components/FrequencySelector";
import { addDoc, collection, serverTimestamp } from "firebase/firestore/lite";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const AddGoal = ({ navigation, open, setOpen, isGroup, groupData }) => {
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [timeShow, setTimeShow] = useState(false);
  const [text, setText] = useState("Empty");
  const [loading, setLoading] = useState(false);
  const refRBSheet = useRef();
  const windowHeight = Dimensions.get("window").height;
  const [showAlert, setShowAlert] = useState(false);
  const OpenRef = () => {
    if (open) {
      refRBSheet.current.open();
    }
  };
  useEffect(() => {
    OpenRef();
  }, [open]);
  //Variable ForUse
  const [image, setImage] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [isEnabled, setIsEnabled] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [goalValue, setGoalValue] = useState("");
  const [unit, setUnit] = useState("Unit");
  const [frequency1, setFrequency1] = useState("Daily");
  const [frequency2, setFrequency2] = useState("Daily");
  const [goal, setGoal] = useState(true);

  const CompleteSubmission = async () => {
    var desiredMaxLength = 24;
    var randomNumber = "";
    for (var i = 0; i < desiredMaxLength; i++) {
      randomNumber += Math.floor(Math.random() * 10);
    }
    if (goal) {
      setLoading(true);
      if (title != "" && description != "") {
        const ref1 = collection(db, "goal");
        const storageRef = ref(storage, "goals/" + randomNumber);
        const val = await fetch(image);
        const imageBlob = await val.blob();

        if (
          title != "" &&
          description != "" &&
          selectedCategory != "" &&
          goalValue != "" &&
          unit != "" &&
          frequency1 != "" &&
          time != "" &&
          frequency2 != "" &&
          date != ""
        ) {
          uploadBytes(storageRef, imageBlob).then((snapshot) => {
            getDownloadURL(storageRef).then(async (url) => {
              if (isGroup) {
                const groupData1 = groupData[1];
                const groupCode = groupData[0];
                const snap = await addDoc(ref1, {
                  title: title,
                  description: description,
                  category: selectedCategory,
                  endDate: date,
                  goalValue: goalValue,
                  unit: unit,
                  goalFrequency: frequency1,
                  notifyTime: time,
                  notifyFrequency: frequency2,
                  public: true,
                  timeStamp: serverTimestamp(),
                  user: auth.currentUser.uid,
                  userName: auth.currentUser.displayName,
                  likes: 0,
                  comment: null,
                  image: url,
                  groupId: groupCode,
                  groupName: groupData1.name,
                  groupImage: groupData1.frontImage,
                });
              } else {
                const snap = await addDoc(ref1, {
                  title: title,
                  description: description,
                  category: selectedCategory,
                  endDate: date,
                  goalValue: goalValue,
                  unit: unit,
                  goalFrequency: frequency1,
                  notifyTime: time,
                  notifyFrequency: frequency2,
                  public: true,
                  timeStamp: serverTimestamp(),
                  user: auth.currentUser.uid,
                  userName: auth.currentUser.displayName,
                  likes: 0,
                  comment: null,
                  image: url,
                });
              }
            });
          });
        }
        setImage(null);
        refRBSheet.current.close();
      } else {
        setShowAlert(true);
      }
      setLoading(false);
    } else {
      setLoading(true);
      if (
        title != "" &&
        description != "" &&
        selectedCategory != "" &&
        goalValue != "" &&
        unit != "" &&
        frequency1 != "" &&
        time != "" &&
        frequency2 != ""
      ) {
        const ref1 = collection(db, "habits");
        const storageRef = ref(storage, "habits/" + randomNumber);
        const val = await fetch(image);
        const imageBlob = await val.blob();
        uploadBytes(storageRef, imageBlob).then((snapshot) => {
          getDownloadURL(storageRef).then(async (url) => {
            if (isGroup) {
              const groupData1 = groupData[1];
              const groupCode = groupData[0];
              const snap = await addDoc(ref1, {
                title: title,
                description: description,
                category: selectedCategory,
                goalValue: goalValue,
                unit: unit,
                goalFrequency: frequency1,
                notifyTime: time,
                notifyFrequency: frequency2,
                public: true,
                timeStamp: serverTimestamp(),
                user: auth.currentUser.uid,
                userName: auth.currentUser.displayName,
                likes: 0,
                comment: null,
                image: url,
                groupId: groupCode,
                groupName: groupData1.name,
                groupImage: groupData1.frontImage,
              });
            } else {
              const snap = await addDoc(ref1, {
                title: title,
                description: description,
                category: selectedCategory,
                goalValue: goalValue,
                unit: unit,
                goalFrequency: frequency1,
                notifyTime: time,
                notifyFrequency: frequency2,
                public: true,
                timeStamp: serverTimestamp(),
                user: auth.currentUser.uid,
                userName: auth.currentUser.displayName,
                likes: 0,
                comment: null,
                image: url,
              });
            }
          });
        });
        setImage(null);
        refRBSheet.current.close();
      } else {
        setShowAlert(true);
      }
      setLoading(false);
    }

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
    } else {
    }
  };

  const onChange = (event, selectedDate) => {
    setDate(selectedDate);
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    let fTime =
      "Hours: " + tempDate.getHours() + " | Minutes: " + tempDate.getMinutes();
    setText(fDate + " (" + fTime + ")");
  };
  const onChange2 = (event, selectedDate) => {
    setTime(selectedDate);
    setTimeShow(false);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <>
      <RBSheet
        height={windowHeight / 1.3}
        ref={refRBSheet}
        openDuration={500}
        onClose={() => setOpen(false)}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "#0000004f",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      >
        <View className="flex flex-row px-5 py-2 pb-4 border-b border-b-gray-200">
          <TouchableOpacity
            onPress={() => setGoal(true)}
            activeOpacity={0.9}
            className={
              goal
                ? "bg-blue-300 border border-blue-300 rounded-xl flex-1 mx-2 py-3"
                : "border border-blue-100 rounded-xl flex-1 mx-2 py-3"
            }
          >
            <Text className="text-center text-blue-900">Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setGoal(false)}
            activeOpacity={0.9}
            className={
              !goal
                ? "bg-blue-300 border border-blue-300 rounded-xl flex-1 mx-2 py-3"
                : "border border-blue-100 rounded-xl flex-1 mx-2 py-3"
            }
          >
            <Text className="text-center">Habit</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="bg-white p-5 px-7 flex flex-col"
        >
          <View>
            <View className="flex flex-row">
              <View className="mr-7">
                <TouchableOpacity
                  disabled={loading}
                  activeOpacity={0.9}
                  onPress={() => pickImageAsync()}
                >
                  {image == null ? (
                    <View className="p-4 bg-gray-300 rounded-xl">
                      <Icon
                        name="image-outline"
                        size={16}
                        style={{ borderRadius: 12 }}
                      />
                    </View>
                  ) : (
                    <Image
                      source={{ uri: image }}
                      className="h-14 w-14 rounded-xl"
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View className="flex-1 px-1">
                <Text className="font-light" style={{ fontSize: 12 }}>
                  Title
                </Text>
                <TextInput
                  editable={!loading}
                  onChangeText={(txt) => setTitle(txt)}
                  multiline
                  numberOfLines={2}
                  placeholder="Eg. Workout Everyday"
                  className="border border-b-gray-300 border-t-0 border-l-0 border-r-0 text-sm my-auto"
                />
              </View>
            </View>
          </View>
          <View>
            <TextInput
              editable={!loading}
              multiline
              onChangeText={(txt) => setDescription(txt)}
              numberOfLines={2}
              placeholder="Description"
              className=" border border-b-gray-300 border-t-0 border-l-0 border-r-0 text-sm mt-7"
            />
          </View>
          <Text className="font-light mt-7 mb-2 ml-2" style={{ fontSize: 12 }}>
            Setting
          </Text>
          <View className="flex-row">
            <View className="flex-1 pr-2">
              <DropDownCategory
                loading={loading}
                changeSelectedCategory={(text) => {
                  setSelectedCategory(text);
                }}
              />
            </View>
            {goal ? (
              <View className="flex-1 ">
                <TouchableOpacity
                  disabled={loading}
                  onPress={() => showMode("date")}
                  activeOpacity={0.9}
                  className="border-orange-600 p-3 rounded-xl border flex flex-row"
                >
                  <Text className="flex-1 text-center text-sm text-orange-800">
                    {date.getFullYear() +
                      "/" +
                      date.getMonth() +
                      "/" +
                      date.getDate()}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View></View>
            )}
          </View>

          <Text className="font-light m-1 mt-5" style={{ fontSize: 12 }}>
            Goal
          </Text>
          <View className="flex flex-row">
            <View className="flex-1 flex flex-row">
              <TextInput
                editable={!loading}
                onChangeText={(txt) => setGoalValue(txt)}
                placeholder="No."
                className="bg-gray-100 rounded-xl flex-1 px-2 mr-2"
              />
              <UnitSelector
                loading={loading}
                changeSelectedCategory={(txt) => setUnit(txt)}
              />
            </View>
            <View className="flex-1">
              <FrequencySelector
                loading={loading}
                changeSelectedCategory={(txt) => setFrequency1(txt)}
              />
            </View>
          </View>
          <Text className="font-light m-1 mt-5" style={{ fontSize: 12 }}>
            Notify
          </Text>
          <View className="flex flex-row">
            <View className="flex-1">
              <TouchableOpacity
                disabled={loading}
                onPress={() => {
                  showMode("time");
                  setTimeShow(true);
                }}
                activeOpacity={0.9}
                className="bg-gray-600 p-3 rounded-xl"
              >
                <Text className="text-center text-sm text-white">
                  {time.getHours()}
                  {time.getHours() >= 12 && time.getHours() <= 23
                    ? " PM  "
                    : " AM  "}
                  {time.getMinutes()} min
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <FrequencySelector
                loading={loading}
                changeSelectedCategory={(txt) => setFrequency2(txt)}
              />
            </View>
          </View>
          <Text className="font-light m-1 mt-5" style={{ fontSize: 12 }}>
            Status
          </Text>
          <View className="flex flex-row">
            <View className="flex-1 flex flex-row">
              <Switch
                disabled={loading}
                trackColor={{ false: "#767577", true: "#008e0033" }}
                thumbColor={isEnabled ? "#009d00" : "#4285F4"}
                ios_backgroundColor="#3e3e3e"
                value={isEnabled}
                onChange={() => setIsEnabled(!isEnabled)}
                style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
              />
              {isEnabled ? (
                <Text className="my-auto mx-3 text-white p-2 px-4 bg-blue-600 rounded-xl">
                  Public
                </Text>
              ) : (
                <Text className="my-auto mx-3 text-white p-2 px-4 bg-gray-600 rounded-xl">
                  Private
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
        {show && (
          <DateTimePicker
            minimumDate={Date.parse(new Date())}
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="compact"
            onChange={onChange}
          />
        )}
        {timeShow && (
          <DateTimePicker
            value={time}
            mode={mode}
            is24Hour={true}
            display="compact"
            onChange={onChange2}
          />
        )}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => CompleteSubmission()}
          className="bg-pink-700 p-4 mx-2 rounded-xl"
        >
          {loading ? (
            <ActivityIndicator color={"#fff"} />
          ) : (
            <Text className="text-center text-white text-base ">Complete</Text>
          )}
        </TouchableOpacity>
      </RBSheet>
    </>
  );
};

export default AddGoal;
