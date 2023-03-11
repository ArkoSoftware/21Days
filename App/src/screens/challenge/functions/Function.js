import { View, Text } from "react-native";
import React from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { auth, db, storage } from "../../../security/firebase";
import { serverTimestamp, addDoc, collection } from "firebase/firestore/lite";

export async function postComment(commentValue, selectedPost, postCommentData) {
  const ref1 = collection(db, "comment", selectedPost, "comment");
  const snap = await addDoc(ref1, {
    comment: commentValue,
    user: auth.currentUser.uid,
    timestamp: { seconds: Date.now() / 1000 },
    profileImage: auth.currentUser.photoURL,
    username: auth.currentUser.displayName,
  });
  const arr = postCommentData;
  arr.unshift({
    comment: commentValue,
    user: auth.currentUser.uid,
    timestamp: { seconds: Date.now() / 1000 },
    profileImage: auth.currentUser.photoURL,
    username: auth.currentUser.displayName,
  });
  console.log(arr);
  return arr;
}

export const postFeed = async (
  setLoading,
  setImage,
  setPostText,
  postText,
  image,
  postData,
  setPostData
) => {
  setLoading(true);
  if (postText != "") {
    const ref1 = collection(db, "post");
    if (image == "") {
      const snap = await addDoc(ref1, {
        userId: auth.currentUser.uid,
        post: postText,
        timestamp: serverTimestamp(),
        profileImage: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        likes: 0,
        comments: null,
        likeList: [],
      }).then((data) => {
        const arrTemp = postData;
        const arr = [
          {
            userId: auth.currentUser.uid,
            post: postText,
            timestamp: serverTimestamp(),
            profileImage: auth.currentUser.photoURL,
            username: auth.currentUser.displayName,
            likes: 0,
            comments: null,
            likeList: [],
          },
          data.id,
        ];
        arrTemp.unshift(arr);
        setPostData(arrTemp);
      });
    } else {
      var desiredMaxLength = 24;
      var randomNumber = "";
      for (var i = 0; i < desiredMaxLength; i++) {
        randomNumber += Math.floor(Math.random() * 10);
      }
      const ref1 = collection(db, "post");
      const storageRef = ref(storage, "postImage/" + randomNumber);
      const val = await fetch(image);
      const imageBlob = await val.blob();
      uploadBytes(storageRef, imageBlob).then((snapshot) => {
        getDownloadURL(storageRef).then(async (url) => {
          const snap = await addDoc(ref1, {
            userId: auth.currentUser.uid,
            post: postText,
            timestamp: serverTimestamp(),
            profileImage: auth.currentUser.photoURL,
            username: auth.currentUser.displayName,
            likes: 0,
            comments: null,
            url: url,
            likeList: [],
          }).then((data) => {
            const arrTemp = postData;
            const arr = [
              {
                userId: auth.currentUser.uid,
                post: postText,
                timestamp: serverTimestamp(),
                profileImage: auth.currentUser.photoURL,
                username: auth.currentUser.displayName,
                likes: 0,
                comments: null,
                url: url,
                likeList: [],
              },
              data.id,
            ];
            arrTemp.unshift(arr);
            setPostData(arrTemp);
          });
        });
      });
    }
  }
  setImage("");
  setLoading(false);
  setPostText("");
};
