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
import React, { useRef } from "react";
import RBSheet from "react-native-raw-bottom-sheet";

const OpenEllipsis = ({
  navigation,
  open,
  setOpen,
  selectedPost,
  selectedPostData,
}) => {
  const refRBSheet = useRef();
  const windowHeight = Dimensions.get("window").height;
  const OpenRef = () => {
    if (open) {
      refRBSheet.current.open();
    }
  };

  return (
    <>
      <RBSheet
        height={windowHeight / 3}
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
          <View className="flex flex-row px-4 py-1 pb-3 pt-4 bg-white  border-b border-b-gray-200 "></View>
        </View>
      </RBSheet>
    </>
  );
};

export default OpenEllipsis;
