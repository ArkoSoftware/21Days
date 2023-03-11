import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "../../../security/firebase";
import { collection, doc, getDocs } from "firebase/firestore/lite";
const Comment = ({ post, rerender }) => {
  const [commentList, setCommentList] = useState([]);
  const getPostComment = async () => {
    const ref1 = collection(db, "challengeComment", post[0], "record");
    const snap = await getDocs(ref1);
    const arr = [];
    snap.forEach((docs) => {
      arr.push(docs.data());
    });
    setCommentList(arr);
  };

  useEffect(() => {
    getPostComment();
  }, [rerender]);
  return (
    <>
      {commentList.map((docs) => (
        <View className="flex flex-row mb-6">
          <View>
            <Image
              source={{ uri: docs.profileImage }}
              className="h-10 w-10 rounded-full"
            />
          </View>
          <View className="flex-1 pl-4 flex flex-col">
            <Text className="font-bold" style={{ fontSize: 16 }}>
              {docs.name}
            </Text>
            <Text className="font-light italic mt-1" style={{ fontSize: 12 }}>
              {docs.comment}
            </Text>
            <View className="flex flex-row mt-1">
              <Text className="flex-1" style={{ fontSize: 10 }}>
                1 h
              </Text>
              <Text className="flex-1" style={{ fontSize: 10 }}>
                {docs.likes} likes
              </Text>
            </View>
          </View>
          <View>
            <Icon
              name="heart-outline"
              color="#C2185B"
              size={18}
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
          </View>
        </View>
      ))}
    </>
  );
};

export default Comment;
