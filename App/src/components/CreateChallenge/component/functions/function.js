import { View, Text } from "react-native";
import React from "react";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../../../../security/firebase";

export const getCategory = async function () {
  const ref1 = doc(db, "challengeInfo", "category");
  const snap = await getDoc(ref1);
  const arr = [];
  for (const key in snap.data()) {
    arr.push(snap.data()[key]);
  }
  return arr;
};
