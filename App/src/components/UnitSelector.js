import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from "react-native";
import React, { useRef, useState } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from "react-native-vector-icons/Ionicons";
const category = [
  "unit",
  "count",
  "steps",
  "m",
  "km",
  "mile",
  "sec",
  "min",
  "hr",
  "ml",
  "oz",
  "cal",
];
const UnitSelector = ({ loading, changeSelectedCategory }) => {
  const [tabIndex, setTabIndex] = useState(null);
  const refRBSheet2 = useRef();
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  return (
    <View className="px-1">
      <TouchableOpacity
        disabled={loading}
        activeOpacity={0.9}
        onPress={() => refRBSheet2.current.open()}
        className="border-gray-500 p-3 rounded-xl border"
      >
        <Text className=" text-center text-sm text-gray-500">
          {tabIndex == null ? "Unit" : category[tabIndex]}
        </Text>
      </TouchableOpacity>
      <RBSheet
        height={windowHeight / 1.3}
        ref={refRBSheet2}
        openDuration={500}
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
        <TextInput
          placeholder="Search"
          className=" p-2 py-3 pl-4 mx-4 border border-gray-300 rounded-xl my-1 bg-gray-100"
        />
        <ScrollView className="p-5">
          {category.map((data, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setTabIndex(index);
                  refRBSheet2.current.close();
                  changeSelectedCategory(category[index]);
                }}
                activeOpacity={0.9}
                className={
                  index == tabIndex
                    ? "flex flex-row border border-green-500 rounded-xl p-4 my-1 py-5"
                    : "flex flex-row border border-gray-200 rounded-xl p-4 my-1 py-5"
                }
                key={index}
              >
                <Icon
                  name="chevron-forward-outline"
                  size={14}
                  style={{ marginTop: "auto", marginBottom: "auto" }}
                />
                <Text className="ml-5 my-auto">{data}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </RBSheet>
    </View>
  );
};

export default UnitSelector;
