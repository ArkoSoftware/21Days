import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PagerView from "react-native-pager-view";
import Dots from "react-native-dots-pagination";
import Img from "../../../assets/image/option.png";
import Logo from "../../../assets/image/logo.png";
import { MAIN_COLOR, SECONDARY_COLOR } from "../../color";
const LoginOption = ({ navigation }) => {
  const [active, setActive] = useState(0);
  return (
    <SafeAreaView className=" flex-1 bg-white">
      <View className="p-5">
        <Image source={Logo} className="w-10 h-10 mx-auto" />
      </View>
      <PagerView
        onPageSelected={(e) => setActive(e.nativeEvent.position)}
        overScrollMode={"never"}
        className="flex-1"
        initialPage={0}
      >
        <View className=" flex flex-col  mx-5 rounded-xl  p-5" key="1">
          <View className="flex-1 ">
            <Image source={Img} className=" h-5/6 w-full rounded-xl " />
          </View>
          <View className=" z-50">
            <Text className="text-center text-2xl font-light  mt-auto">
              Join and Create a Community
            </Text>
          </View>
        </View>
        <View className=" flex flex-col  mx-5 rounded-xl  p-5" key="2">
          <View className="flex-1 ">
            <Image source={Img} className=" h-5/6 w-full rounded-xl " />
          </View>
          <View className=" z-50">
            <Text className="text-center text-2xl font-light  mt-auto">
              Pick a Habit or Goal
            </Text>
          </View>
        </View>
        <View className=" flex flex-col  mx-5 rounded-xl  p-5" key="3">
          <View className="flex-1 ">
            <Image source={Img} className=" h-5/6 w-full rounded-xl " />
          </View>
          <View className=" z-50">
            <Text className="text-center text-2xl font-light  mt-auto">
              Help Others Along The Way
            </Text>
          </View>
        </View>
      </PagerView>
      <View className=" mt-5">
        <Dots
          length={3}
          active={active}
          activeDotWidth={10}
          activeDotHeight={10}
        />
      </View>
      <View className="border border-b-0 border-gray-200 mx-10 mt-10"></View>

      <View className=" py-7 px-7">
        <View className="flex flex-row mx-auto my-auto  w-full">
          <TouchableOpacity
            className="mx-2 flex-1 h-12 rounded-xl"
            style={{ backgroundColor: MAIN_COLOR }}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Login", { emailVerify: false })}
          >
            <Text className="text-center text-white my-auto font-light ">
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="mx-2 border flex-1 h-13 rounded-xl"
            style={{ borderColor: MAIN_COLOR }}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("CreateAccount")}
          >
            <Text
              style={{ color: MAIN_COLOR }}
              className="text-center my-auto font-light "
            >
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginOption;
