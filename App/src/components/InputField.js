import { View, Text, TextInput } from "react-native";
import React from "react";

const InputField = ({ label, setState, state, error = false }) => {
  return (
    <>
      {!error ? (
        <View className="flex flex-col">
          <Text
            className="font-bold m-1 mx-3 tracking-tighter text-gray-600"
            style={{ fontSize: 18 }}
          >
            {label}
          </Text>
          <TextInput
            value={state}
            onChangeText={(txt) => setState(txt)}
            placeholder={label}
            style={{ fontSize: 14 }}
            className="p-2 border border-gray-300 rounded-lg mx-1 px-4"
          />
        </View>
      ) : (
        <View className="flex flex-col">
          <Text
            className="font-bold m-1 mx-3 tracking-tighter text-gray-600"
            style={{ fontSize: 18 }}
          >
            {label}
          </Text>
          <TextInput
            value={state}
            onChangeText={(txt) => setState(txt)}
            placeholder={label}
            style={{ fontSize: 14 }}
            className="p-2 border border-red-300 bg-red-50 rounded-lg mx-1 px-4"
          />
        </View>
      )}
    </>
  );
};

export default InputField;
