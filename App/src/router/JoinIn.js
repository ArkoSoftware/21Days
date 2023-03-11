import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../security/firebase";
import GetProfilePhoto from "../screens/getProfile/GetProfilePhoto";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import Loading from "../components/Loading";
import GetGender from "../screens/getProfile/GetGender";
import MainRouter from "./MainRouter";
import GetAge from "../screens/getProfile/GetAge";
import GetBio from "../screens/getProfile/GetBio";
const JoinIn = () => {
  const [route, setRoute] = useState(0);
  const [refresh, setRefresh] = useState(true);
  const getProfile = async () => {
    const ref = doc(db, "user", auth.currentUser.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      if (!data.hasOwnProperty("gender")) {
        setRoute(2);
        return;
      }
      if (!data.hasOwnProperty("dob")) {
        setRoute(4);
        return;
      }
      if (!data.hasOwnProperty("bio")) {
        setRoute(5);
        return;
      }
      if (!data.hasOwnProperty("image")) {
        setRoute(1);
        return;
      }

      setRoute(3);
    } else {
      const snap1 = await setDoc(ref, {
        email: auth.currentUser.email,
        name: auth.currentUser.displayName,
        emailVerified: auth.currentUser.emailVerified,
        createdAt: auth.currentUser.toJSON()["createdAt"],
      });
    }
    setRefresh(!refresh);
  };

  useEffect(() => {
    getProfile();
  }, [refresh]);
  if (route == 0) {
    return <Loading />;
  }
  if (route == 1) {
    return (
      <GetProfilePhoto
        refresh={(term) => {
          setRoute(0);
          setRefresh(!refresh);
        }}
      />
    );
  }
  if (route == 2) {
    return (
      <GetGender
        refresh={(term) => {
          setRoute(0);
          setRefresh(!refresh);
        }}
      />
    );
  }
  if (route == 4) {
    return (
      <GetAge
        refresh={(term) => {
          setRoute(0);
          setRefresh(!refresh);
        }}
      />
    );
  }
  if (route == 5) {
    return (
      <GetBio
        refresh={(term) => {
          setRoute(0);
          setRefresh(!refresh);
        }}
      />
    );
  }
  if (route == 3) {
    return <MainRouter />;
  }
};

export default JoinIn;
