import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import RBSheet from "react-native-raw-bottom-sheet";
import { getCategory } from "./functions/function";
const windowHeight = Dimensions.get("window").height;

const HabitOrGoal = ({ state, setState }) => {
  const [openCategory, setOpenCategory] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const refRBSheet = useRef();
  const OpenRef = () => {
    if (openCategory) {
      refRBSheet.current.open();
    }
  };
  const getInfo = async () => {
    const data = await getCategory();
    setCategoryData(data);
  };
  useEffect(() => {
    OpenRef();
  }, [openCategory]);
  useEffect(() => {
    getInfo();
  }, []);

  return (
    <View className="flex flex-col">
      <View className="flex flex-row flex-wrap space-x-2">
        {state ? (
          <>
            <View className="flex-1">
              <TouchableOpacity
                onPress={() => setState(false)}
                className=" flex-1 border border-blue-300 p-3 px-5 rounded-xl my-3 flex flex-row space-x-3"
              >
                <View className="flex flex-row mx-auto space-x-2">
                  <Icon name="medal-outline" size={18} color={"#000"} />
                  <Text className="text-sm">Goal</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <TouchableOpacity
                onPress={() => setState(true)}
                className="flex-1 border border-green-600 p-3 px-5 rounded-xl my-3 bg-green-50 flex flex-row space-x-3 "
              >
                <View className="flex flex-row mx-auto space-x-2">
                  <Icon name="hourglass-outline" size={18} color={"#000"} />
                  <Text className="text-sm ">Habit</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => setState(false)}
              className=" flex-1 border border-green-600 p-3 px-5 rounded-xl my-3 bg-green-50 flex flex-row space-x-3"
            >
              <View className="flex flex-row mx-auto space-x-2">
                <Icon name="medal-outline" size={18} color={"#000"} />
                <Text className="text-sm">Goal</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setState(true)}
              className="flex-1 border border-blue-300 p-3 px-5 rounded-xl my-3 flex flex-row space-x-3 "
            >
              <View className="flex flex-row mx-auto space-x-2">
                <Icon name="hourglass-outline" size={18} color={"#000"} />
                <Text className="text-sm ">Habit</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default HabitOrGoal;
