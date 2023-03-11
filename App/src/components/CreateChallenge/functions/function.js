import { View, Text } from "react-native";
import React from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../../security/firebase";
import { addDoc, collection } from "firebase/firestore/lite";
export const CompleteSubmission = async function (data) {
  var desiredMaxLength = 24;
  var randomNumber = "";
  for (var i = 0; i < desiredMaxLength; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }

  const ref1 = collection(db, "challenges");
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
          const snap = await addDoc(ref1, {
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
          const snap = await addDoc(ref1, {
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

/*
var desiredMaxLength = 24;
  var randomNumber = "";
  for (var i = 0; i < desiredMaxLength; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }
  if (goal) {
    setLoading(true);
    if (title != "" && description != "") {
      const ref1 = collection(db, "goal");
      const storageRef = ref(storage, "goals/" + randomNumber);
      const val = await fetch(image);
      const imageBlob = await val.blob();

      if (
        title != "" &&
        description != "" &&
        selectedCategory != "" &&
        goalValue != "" &&
        unit != "" &&
        frequency1 != "" &&
        time != "" &&
        frequency2 != "" &&
        date != ""
      ) {
        uploadBytes(storageRef, imageBlob).then((snapshot) => {
          getDownloadURL(storageRef).then(async (url) => {
            if (isGroup) {
              const groupData1 = groupData[1];
              const groupCode = groupData[0];
              const snap = await addDoc(ref1, {
                title: title,
                description: description,
                category: selectedCategory,
                endDate: date,
                goalValue: goalValue,
                unit: unit,
                goalFrequency: frequency1,
                notifyTime: time,
                notifyFrequency: frequency2,
                public: true,
                timeStamp: serverTimestamp(),
                user: auth.currentUser.uid,
                userName: auth.currentUser.displayName,
                likes: 0,
                comment: null,
                image: url,
                groupId: groupCode,
                groupName: groupData1.name,
                groupImage: groupData1.frontImage,
              });
            } else {
              const snap = await addDoc(ref1, {
                title: title,
                description: description,
                category: selectedCategory,
                endDate: date,
                goalValue: goalValue,
                unit: unit,
                goalFrequency: frequency1,
                notifyTime: time,
                notifyFrequency: frequency2,
                public: true,
                timeStamp: serverTimestamp(),
                user: auth.currentUser.uid,
                userName: auth.currentUser.displayName,
                likes: 0,
                comment: null,
                image: url,
              });
            }
          });
        });
      }
      setImage(null);
      refRBSheet.current.close();
    } else {
      setShowAlert(true);
    }
    setLoading(false);
  } else {
    setLoading(true);
    if (
      title != "" &&
      description != "" &&
      selectedCategory != "" &&
      goalValue != "" &&
      unit != "" &&
      frequency1 != "" &&
      time != "" &&
      frequency2 != ""
    ) {
      const ref1 = collection(db, "habits");
      const storageRef = ref(storage, "habits/" + randomNumber);
      const val = await fetch(image);
      const imageBlob = await val.blob();
      uploadBytes(storageRef, imageBlob).then((snapshot) => {
        getDownloadURL(storageRef).then(async (url) => {
          if (isGroup) {
            const groupData1 = groupData[1];
            const groupCode = groupData[0];
            const snap = await addDoc(ref1, {
              title: title,
              description: description,
              category: selectedCategory,
              goalValue: goalValue,
              unit: unit,
              goalFrequency: frequency1,
              notifyTime: time,
              notifyFrequency: frequency2,
              public: true,
              timeStamp: serverTimestamp(),
              user: auth.currentUser.uid,
              userName: auth.currentUser.displayName,
              likes: 0,
              comment: null,
              image: url,
              groupId: groupCode,
              groupName: groupData1.name,
              groupImage: groupData1.frontImage,
            });
          } else {
            const snap = await addDoc(ref1, {
              title: title,
              description: description,
              category: selectedCategory,
              goalValue: goalValue,
              unit: unit,
              goalFrequency: frequency1,
              notifyTime: time,
              notifyFrequency: frequency2,
              public: true,
              timeStamp: serverTimestamp(),
              user: auth.currentUser.uid,
              userName: auth.currentUser.displayName,
              likes: 0,
              comment: null,
              image: url,
            });
          }
        });
      });
      setImage(null);
      refRBSheet.current.close();
    } else {
      setShowAlert(true);
    }
    setLoading(false);
  }

  setLoading(false);
  */
