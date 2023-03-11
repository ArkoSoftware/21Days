import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../security/firebase";
import Auth from "../router/Auth";
import JoinIn from "./JoinIn";
import Loading from "../components/Loading";
const AuthCheck = () => {
  const [route, setRoute] = useState(0);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (user.emailVerified) {
        setRoute(2);
      } else {
        signOut(auth);
      }
    } else {
      setRoute(1);
    }
  });
  if (route == 0) {
    return <Loading />;
  }
  if (route == 1) {
    return <Auth />;
  }
  if (route == 2) {
    return <JoinIn />;
  }
};

export default AuthCheck;
