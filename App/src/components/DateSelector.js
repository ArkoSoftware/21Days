import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useRef, useState } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from "react-native-vector-icons/Ionicons";

const DateSelector = ({ loading, changeSelectedCategory }) => {
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
        className="border-orange-600 p-3 rounded-xl border flex flex-row"
      >
        <Text className="flex-1 text-center text-sm text-orange-800">
          {tabIndex == null ? "Date" : category[tabIndex]}
        </Text>
      </TouchableOpacity>
      <RBSheet
        height={windowHeight / 1.5}
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
      </RBSheet>
    </View>
  );
};

export default DateSelector;
