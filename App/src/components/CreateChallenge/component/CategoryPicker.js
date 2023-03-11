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

const CategoryPicker = ({ label, setState, state, error = false }) => {
  const [openCategory, setOpenCategory] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const refRBSheet = useRef();
  const OpenRef = () => {
    if (openCategory) {
      refRBSheet.current.open();
    }
  };
  const ToggleRBSheet = () => {
    setOpenCategory(!openCategory);
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
      <Text
        className="font-bold tracking-tighter text-gray-600 my-1"
        style={{ fontSize: 18 }}
      >
        {label}
      </Text>
      <View className="flex flex-row flex-wrap space-x-2">
        {state !== "" && (
          <TouchableOpacity className="border border-green-400 p-3 px-5 rounded-xl my-3 bg-green-50 flex flex-row space-x-3">
            <Icon name={state[0]} size={18} color={"#000"} />
            <Text className="text-sm">{state[1]}</Text>
          </TouchableOpacity>
        )}

        {!error ? (
          <TouchableOpacity
            onPress={() => {
              ToggleRBSheet();
            }}
            className="border border-purple-400 p-3 px-5 rounded-xl my-3 bg-purple-50 flex flex-row space-x-3"
          >
            <Icon name={"add"} size={18} color={"#000"} />
            <Text className="text-sm">Choose</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              ToggleRBSheet();
            }}
            className="border border-red-400 p-3 px-5 rounded-xl my-3 bg-red-50 flex flex-row space-x-3"
          >
            <Icon name={"add"} size={18} color={"#000"} />
            <Text className="text-sm">Choose</Text>
          </TouchableOpacity>
        )}
      </View>
      <RBSheet
        height={windowHeight / 2}
        ref={refRBSheet}
        openDuration={500}
        onClose={ToggleRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "#000000af",
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
          <Text className="font-bold text-2xl m-5">Category</Text>
          <View className="flex flex-row flex-wrap p-5 pt-0">
            {categoryData.map((d1) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setState(d1);
                    refRBSheet.current.close();
                  }}
                  className="border border-blue-400 p-3 px-5 rounded-xl my-2 bg-blue-50 flex flex-row space-x-3 mr-2"
                >
                  <Icon name={d1[0]} size={18} color={"#000"} />
                  <Text className="text-sm">{d1[1]}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </RBSheet>
    </View>
  );
};

export default CategoryPicker;
