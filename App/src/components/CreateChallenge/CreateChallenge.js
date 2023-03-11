import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import RBSheet from "react-native-raw-bottom-sheet";
import InputField from "../InputField";
import CategoryPicker from "./component/CategoryPicker";
import DatePicker from "../DatePicker";
import HabitOrGoal from "./component/HabitOrGoal";
import FrequencyPicker from "./component/FrequencyPicker";
import { pickImageAsync } from "../../globalFunctions/functions";
import { CompleteSubmission } from "./functions/function";
import Loading from "../Loading";
const windowHeight = Dimensions.get("window").height;

const frequency = ["Monthly", "Daily", "Weekly", "Hourly"];

const CreateChallenge = ({ open, setOpen, group, groupId }) => {
  const [isLoading, setIsLoading] = useState(false);
  // React Hooks
  const [image, setImage] = useState("");
  const [habit, setHabit] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [habitFrequency, setHabitFrequency] = useState("");
  const [notifyFrequency, setNotifyFrequency] = useState("");
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [errorField, setErrorField] = useState([]);
  //React Sheet Hooks
  const refRBSheet = useRef();

  const resetState = () => {
    setImage("");
    setHabit(false);
    setTaskTitle("");
    setCategory("");
    setStartDate(new Date());
    setEndDate(new Date());
    setHabitFrequency("");
    setNotifyFrequency("");
    setNotifyFrequency("");
    setNotificationTime(new Date());
  };
  const OpenRef = () => {
    if (open) {
      refRBSheet.current.open();
    }
  };
  const ToggleRBSheet = () => {
    setOpen(!open);
  };
  useEffect(() => {
    OpenRef();
  }, [open]);
  const pickImage = async function () {
    const arr = await pickImageAsync();
    setImage(arr);
  };
  const submitForm = async function () {
    const error = [];
    if (taskTitle == "" || taskTitle == null) {
      error.push("title");
    }
    if (category == "" || category == null) {
      error.push("category");
    }
    if (startDate == "" || startDate == null) {
      error.push("startDate");
    }
    if (endDate == "" || endDate == null) {
      error.push("endDate");
    }
    if (image == "" || image == null) {
      error.push("image");
    }
    setErrorField(error);
    if (error.length == 0) {
      setIsLoading(true);
      await CompleteSubmission({
        taskTitle: taskTitle,
        habit: habit,
        category: category,
        startDate: startDate,
        endDate: endDate,
        habitFrequency: habitFrequency,
        notifyFrequency: notifyFrequency,
        notificationTime: notificationTime,
        image: image,
        group: group,
        groupId: groupId,
      });
      resetState();
      setIsLoading(false);
      refRBSheet.current.close();
    }
  };
  return (
    <>
      <RBSheet
        height={windowHeight / 1.05}
        ref={refRBSheet}
        openDuration={500}
        onClose={ToggleRBSheet}
        closeOnDragDown={false}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "#0000004f",
          },
          draggableIcon: {
            display: "none",
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      >
        <ScrollView>
          <View className="border-b border-b-gray-100 p-7 pb-3 flex flex-row">
            <Text className="text-center font-extrabold text-2xl tracking-tighter mx-auto">
              Create Task
            </Text>
            <TouchableOpacity onPress={() => refRBSheet.current.close()}>
              <Icon name="close" size={20} />
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <View className="mt-16">
              <Loading />
            </View>
          ) : (
            <>
              <View className="p-3 flex flex-row">
                <View className="flex-1">
                  <InputField
                    error={errorField.includes("title") ? true : false}
                    label={"Task Title"}
                    setState={setTaskTitle}
                  />
                </View>
                <View className="my-auto px-3">
                  {image == "" || image == null ? (
                    <TouchableOpacity
                      className={
                        errorField.includes("image")
                          ? "p-2 border-red-500 bg-red-50 rounded-xl my-auto"
                          : "p-2 my-auto"
                      }
                      onPress={() => pickImage()}
                    >
                      <Icon name="image" size={38} />
                    </TouchableOpacity>
                  ) : (
                    <Image
                      source={{ uri: image }}
                      className=" h-20 w-20 rounded "
                    />
                  )}
                </View>
              </View>
              <View className="px-3">
                <HabitOrGoal state={habit} setState={setHabit} />
              </View>
              <View className="px-3">
                <CategoryPicker
                  error={errorField.includes("category") ? true : false}
                  label={"Category Picker"}
                  state={category}
                  setState={setCategory}
                />
              </View>
              <View className="px-3 flex flex-row">
                <View className="flex-1">
                  <DatePicker
                    error={errorField.includes("startDate") ? true : false}
                    label={"Start Date"}
                    setState={setStartDate}
                    date={startDate}
                  />
                </View>
                <View className="flex-1">
                  <DatePicker
                    error={errorField.includes("endDate") ? true : false}
                    label={"End Date"}
                    setState={setEndDate}
                    date={endDate}
                  />
                </View>
              </View>
              <View className="px-3 py-2">
                {habit && (
                  <FrequencyPicker
                    label="Habit Frequency"
                    state={habitFrequency}
                    setState={setHabitFrequency}
                    data={frequency}
                  />
                )}
              </View>
              <View className="px-3">
                <FrequencyPicker
                  label="Notify Me"
                  state={notifyFrequency}
                  setState={setNotifyFrequency}
                  data={frequency}
                />
              </View>
              <View className="px-3">
                <DatePicker
                  label={"Notification Time"}
                  setState={setNotificationTime}
                  date={notificationTime}
                  time={true}
                />
              </View>
              <TouchableOpacity
                onPress={() => submitForm()}
                className="bg-green-700 rounded-xl text-center p-4 mx-3 my-2 mt-5"
              >
                <Text className="text-sm text-center text-white">
                  Create Task
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </RBSheet>
    </>
  );
};

export default CreateChallenge;
