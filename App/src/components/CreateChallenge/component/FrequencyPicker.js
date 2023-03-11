import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
const windowHeight = Dimensions.get("window").height;

const FrequencyPicker = ({ label, data, state, setState }) => {
  return (
    <View className="flex flex-col">
      <Text
        className="font-bold tracking-tighter text-gray-600 my-1"
        style={{ fontSize: 18 }}
      >
        {label}
      </Text>
      <View className="flex flex-row flex-wrap space-x-2">
        {data.map((d1) => {
          return (
            <>
              {state == d1 ? (
                <TouchableOpacity
                  onPress={() => setState(d1)}
                  className="border border-green-400 p-3 px-5 rounded-xl my-3 bg-green-50 flex flex-row mr-2"
                >
                  <Text className="text-sm">{d1}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setState(d1)}
                  className="border border-blue-400 p-3 px-5 rounded-xl my-3 flex flex-row mr-2"
                >
                  <Text className="text-sm">{d1}</Text>
                </TouchableOpacity>
              )}
            </>
          );
        })}
      </View>
    </View>
  );
};

export default FrequencyPicker;
