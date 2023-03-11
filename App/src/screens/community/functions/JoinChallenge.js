import { View, Text } from "react-native";
import React from "react";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";
import { auth, db } from "../../../security/firebase";
import { update } from "firebase/database";
export async function leaveGroup(item){
  const doc1=doc(db,'challenges',item[0])
  const doc2=doc(db,'user',auth.currentUser.uid)
  const snap=await getDoc(doc1)
  if( snap.data()['followerList'].includes(auth.currentUser.uid )){
    const snap2=await updateDoc(doc1,{followerList:arrayRemove(auth.currentUser.uid)})
    const snap3=await updateDoc(doc2,{challengeList:arrayRemove(item[0])})
  }
}
export async function JoinChallenge(item) {
  if (item.public) {
    const ref2 = doc(db, "challenges", item[0]);
    const snap3 = updateDoc(ref2, {
      followers: increment(1),
      followerList: arrayUnion(auth.currentUser.uid),
    });
    const ref3 = doc(db, "user", auth.currentUser.uid);
    const snap4 = updateDoc(ref3, {
      challengeList: arrayUnion(item[0]),
    });

    const snap2 = await getDoc(ref2);
    const data = snap2.data();
    const ref1 = collection(
      db,
      "joinChallenge",
      snap2.id,
      auth.currentUser.uid
    );
    const snap = await addDoc(ref1, {
      userId: auth.currentUser.uid,
      date: serverTimestamp(),
    });
  } else {
    const ref2 = collection(db, "joinChallengeRequest", item[0], "record");
    const snap3 = await addDoc(ref2, {
      user: auth.currentUser.uid,
      time: serverTimestamp(),
    });
    const ref1 = doc(db, "user", auth.currentUser.uid);
    const snap = await updateDoc(ref1, { requestSent: arrayUnion(item[0]) });
  }
}
export async function BookMark(item) {
  const ref2 = doc(db, "challenges", item[0]);
  const snap3 = updateDoc(ref2, {
    bookMarkers: increment(1),
    bookMarkList: arrayUnion(auth.currentUser.uid),
  });
  const ref3 = doc(db, "user", auth.currentUser.uid);
  const snap4 = updateDoc(ref3, {
    bookMarkList: arrayUnion(item[0]),
  });
}

export async function removeBookMark(item) {}

export async function LikeChallenge(user, postId) {
  const ref1 = doc(db, "user", user);
  const snap = await updateDoc(ref1, { likedChallenge: arrayUnion(postId) });
  const ref2 = doc(db, "challenges", postId);
  const snap2 = await updateDoc(ref2, {
    likedChallenge: arrayUnion(user),
    likes: increment(1),
  });
}
export async function unLikeChallenge(user, postId) {
  const ref1 = doc(db, "user", user);
  const snap = await updateDoc(ref1, { likedChallenge: arrayRemove(postId) });
  const ref2 = doc(db, "challenges", postId);
  const snap2 = await updateDoc(ref2, {
    likedChallenge: arrayRemove(user),
    likes: increment(-1),
  });
}
export async function getAllJoinRequestData(id) {
  const ref1 = collection(db, "joinChallengeRequest", id, "record");
  const snap = await getDocs(ref1);
  const arr = [];
  await Promise.all(
    snap.docs.map(async (docs) => {
      const doc1 = doc(db, "user", docs.data().user);
      const snap1 = await getDoc(doc1);
      arr.push([docs.id, docs.data(), snap1.data()]);
    })
  );
  return arr;
}

export async function allowGroupEntry(id, user, groupId) {
  const ref1 = doc(db, "joinChallengeRequest", id, "record", user);
  const snap = await deleteDoc(ref1);
  const ref2 = doc(db, "challenges", id);
  const snap2 = await updateDoc(ref2, { followerList: arrayUnion(groupId) });

  const ref3 = doc(db, "user", groupId);
  const snap3 = await updateDoc(ref3, { challengeList: arrayUnion(id) });
  const snap4 = await updateDoc(ref3, { requestSent: arrayRemove(id) });

}
