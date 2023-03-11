import { View, Text } from "react-native";
import React from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../../security/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore/lite";
export const CompleteSubmission = async function (data) {
  var desiredMaxLength = 24;
  var randomNumber = "";
  for (var i = 0; i < desiredMaxLength; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }

  const ref1 = doc(db, "challenges", data.document);
  const storageRef = ref(storage, "challenges/" + randomNumber);
  const val = await fetch(data.image);
  const imageBlob = await val.blob();

  if (
    data.taskTitle != "" &&
    data.category != "" &&
    data.startDate != "" &&
    data.endDate != "" &&
    data.image != ""
  ) {
    await uploadBytes(storageRef, imageBlob).then(async (snapshot) => {
      await getDownloadURL(storageRef).then(async (url) => {
        if (data.group) {
          const snap = await updateDoc(ref1, {
            taskTitle: data.taskTitle,
            habit: data.habit,
            category: data.category,
            startDate: data.startDate,
            endDate: data.endDate,
            habitFrequency: data.habitFrequency,
            notifyFrequency: data.notifyFrequency,
            notificationTime: data.notificationTime,
            image: url,
            user: auth.currentUser.uid,
            user: auth.currentUser.uid,
            userName: auth.currentUser.displayName,
            likes: 0,
            comment: null,
            public: true,
            group: data.group,
            groupId: data.groupId,
          });
        } else {
          const snap = await updateDoc(ref1, {
            taskTitle: data.taskTitle,
            habit: data.habit,
            category: data.category,
            startDate: data.startDate,
            endDate: data.endDate,
            habitFrequency: data.habitFrequency,
            notifyFrequency: data.notifyFrequency,
            notificationTime: data.notificationTime,
            image: url,
            user: auth.currentUser.uid,
            user: auth.currentUser.uid,
            userName: auth.currentUser.displayName,
            likes: 0,
            comment: null,
            public: true,
          });
        }
      });
    });
  }
};
