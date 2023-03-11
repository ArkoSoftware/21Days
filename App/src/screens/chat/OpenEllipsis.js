import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Platform,
  Switch,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef } from "react";
import RBSheet from "react-native-raw-bottom-sheet";

const OpenEllipsis = ({
  navigation,
  open,
  setOpen,
  selectedPost,
  selectedPostData,
  deleteData,
}) => {
  const refRBSheet = useRef();
  const windowHeight = Dimensions.get("window").height;
  const OpenRef = () => {
    if (open) {
      refRBSheet.current.open();
    }
  };
  useEffect(() => {
    OpenRef();
  }, [open]);

  return (
    <>
      <RBSheet
        height={windowHeight / 6}
        ref={refRBSheet}
        openDuration={500}
        onClose={() => {
          setOpen(false);
        }}
        closeOnDragDown={false}
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
        <View className="flex-1">
          <View className="flex flex-row px-4 py-1 pb-3 pt-4 bg-white my-auto">
            <TouchableOpacity
              onPress={() => {
                deleteData();
                navigation.navigate("InboxRouter");
              }}
              className="bg-red-700 rounded-xl w-full p-3 my-auto"
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Delete Chat
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </>
  );
};

export default OpenEllipsis;
