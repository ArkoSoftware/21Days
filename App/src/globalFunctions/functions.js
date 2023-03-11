import { View, Text } from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";

export const pickImageAsync = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    quality: 1,
    base64: true,
  });

  if (!result.canceled) {
    return result["assets"][0]["uri"];
  } else {
  }
};
