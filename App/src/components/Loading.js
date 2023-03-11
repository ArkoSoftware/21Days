import { View, Text } from "react-native";
import React, { useRef } from "react";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Anim1 from "../../assets/animation/loading.json";
const Loading = ({ message }) => {
  const animation = useRef();
  return (
    <SafeAreaView className="flex-1 bg-white">
      {message != "" ? (
        <View className="flex flex-col my-auto mx-auto">
          <LottieView
            autoPlay
            ref={animation}
            style={{
              width: 50,
              height: 50,
              backgroundColor: "#fff",
            }}
            className="mx-auto"
            source={Anim1}
          />
          <Text className="mt-5 text-sm tracking-tighter text-gray-700 ">
            {message}
          </Text>
        </View>
      ) : (
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 50,
            height: 50,
            backgroundColor: "#fff",
          }}
          source={Anim1}
          className="mx-auto my-auto"
        />
      )}
    </SafeAreaView>
  );
};

export default Loading;
