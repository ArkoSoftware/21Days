import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePicker = ({
  label,
  setState,
  date = new Date(),
  time,
  min = true,
  max = false,
  error = false,
}) => {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(label);
  const onChange = (event) => {
    if (event.type == "set") {
      setState(new Date(event.nativeEvent.timestamp));
      setShow(false);
      const d1 = new Date(event.nativeEvent.timestamp);
      const time1 = new Date(event.nativeEvent.timestamp).toTimeString();
      if (time) {
        setCurrent(time1.slice(0, 8));
      } else {
        setCurrent(d1.toDateString());
      }
    }
  };
  return (
    <View className="flex flex-col ">
      <Text
        className="font-bold m-1 mx-3 tracking-tighter text-gray-600"
        style={{ fontSize: 18 }}
      >
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => setShow(!show)}
        style={{ fontSize: 14 }}
        className={
          error
            ? "p-4 border border-red-300 rounded-lg mx-1 px-4 bg-red-50"
            : "p-4 border border-gray-300 rounded-lg mx-1 px-4 "
        }
      >
        <Text>{current}</Text>
      </TouchableOpacity>
      {show ? (
        <>
          {time ? (
            <DateTimePicker
              minimumDate={Date.parse(new Date())}
              testID="dateTimePicker"
              value={date}
              mode={"time"}
              is24Hour={true}
              onChange={onChange}
            />
          ) : (
            <DateTimePicker
              minimumDate={min ? Date.parse(new Date()) : new Date(1950, 0, 1)}
              maximumDate={max ? Date.parse(new Date()) : new Date(2100, 0, 1)}
              testID="dateTimePicker"
              value={date}
              mode={"date"}
              is24Hour={true}
              display="compact"
              onChange={onChange}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

export default DatePicker;
