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
import React, { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import RBSheet from "react-native-raw-bottom-sheet";
import { auth, storage, db } from "../../../security/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore/lite";
import { postComment } from "../functions/Function";
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const OpenComment = ({
  navigation,
  open,
  setOpen,
  selectedPost,
  selectedPostData,
}) => {
  const [commentValue, setCommentValue] = useState("");
  const [postData, setPostData] = useState({});
  const [postCommentData, setPostCommentData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [reRender, setRerender] = useState(false);
  const refRBSheet = useRef();
  const windowHeight = Dimensions.get("window").height;
  const OpenRef = () => {
    if (open) {
      refRBSheet.current.open();
    }
  };
  const getCommentData = async () => {
    const ref1 = collection(db, "comment", selectedPost, "comment");
    const snap = await getDocs(ref1);
    const arr = [];
    snap.forEach((docs) => {
      const data = docs.data();
      arr.push([data, docs.id]);
    });
    setPostCommentData(arr);
  };
  useEffect(() => {
    OpenRef();
    getCommentData();
  }, [open, reRender]);

  return (
    <>
      <RBSheet
        height={windowHeight / 1.07}
        ref={refRBSheet}
        openDuration={500}
        onClose={() => {
          setOpen(false);
          setPostCommentData([]);
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
          <View className="flex flex-row px-4 py-1 pb-3 pt-4 bg-white  border-b border-b-gray-200 ">
            <View>
              <Image
                source={{ uri: selectedPostData.profileImage }}
                className="w-12 h-12 rounded-full mb-auto"
              />
            </View>
            <View className="flex flex-col pl-3 flex-1">
              <View className="flex flex-row">
                <TouchableOpacity
                  onPress={() => {
                    if (auth.currentUser.uid == selectedPostData.userId) {
                      navigation.navigate("ProfileRouter");
                    } else {
                      navigation.navigate("VisitProfile", {
                        data: selectedPostData.userId,
                      });
                    }
                  }}
                >
                  <Text className=" font-extrabold text-base mr-2">
                    {selectedPostData.username}
                  </Text>
                </TouchableOpacity>
                <View className="flex flex-row">
                  <Icon
                    name="stop"
                    size={3}
                    color="#9f9f9f"
                    style={{
                      marginTop: "auto",
                      marginBottom: "auto",
                      marginRight: 5,
                    }}
                  />
                  <Text className=" font-light text-sm my-auto">9h</Text>
                </View>
                <TouchableOpacity className="ml-auto">
                  <Icon
                    name="ellipsis-vertical-outline"
                    size={20}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
              <Text className="tracking-wide mt-1">
                {selectedPostData.post}
              </Text>
            </View>
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => getCommentData()}
              />
            }
          >
            {postCommentData.length != 0 ? (
              <>
                {postCommentData.map((docs, index) => {
                  if (docs[0] != null) {
                    var date = new Date(docs[0]["timestamp"]["seconds"] * 1000);

                    return (
                      <View key={index} className="p-3">
                        <View className="flex-row">
                          <Image
                            source={{ uri: docs[0].profileImage }}
                            className="h-10 w-10 rounded-full"
                          />
                          <View className="flex flex-col">
                            <TouchableOpacity
                              onPress={() => {
                                if (auth.currentUser.uid != docs[0].user) {
                                  refRBSheet.current.close();
                                  navigation.navigate("VisitProfile", {
                                    data: docs[0].user,
                                  });
                                }
                              }}
                            >
                              <Text className="mx-4 font-bold">
                                {docs[0].username}
                              </Text>
                            </TouchableOpacity>
                            <Text className="mx-4">{docs[0].comment}</Text>
                            <Text
                              className="mx-4 mt-2"
                              style={{ fontSize: 10 }}
                            >
                              {date.getDate() +
                                " " +
                                monthNames[date.getMonth()] +
                                " " +
                                date.getFullYear()}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  }
                })}
              </>
            ) : (
              <></>
            )}
          </ScrollView>

          <View className=" p-3 m-3 mt-auto rounded-full bg-gray-200 flex flex-row">
            <View className="flex-1">
              <TextInput
                className="text-base px-2 flex-1 mx-3"
                value={commentValue}
                onChangeText={(txt) => setCommentValue(txt)}
                placeholder="Comment..."
              />
            </View>
            <TouchableOpacity
              onPress={async () => {
                if (commentValue != "") {
                  var newList = await postComment(
                    commentValue,
                    selectedPost,
                    postCommentData
                  );
                  setCommentValue("");
                  setRerender(!reRender);
                }
              }}
              className="ml-auto my-auto mr-4"
            >
              <Icon name="paper-plane" size={24} color="#194BFD" />
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </>
  );
};

export default OpenComment;
