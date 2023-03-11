import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import React, { createContext, useEffect } from "react";
// import { app } from "../security/firebase"; 
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext(); 

const AuthProvider = ({ children }) => {
  const googleProvider = new GoogleAuthProvider();

  const signInWithFacebook = async () => { 
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);
    if (result.isCancelled) {
      throw "User Login Failed!";
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw "Something went wrong obtaining access token";
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken
    );
    return auth().signInWithCredential(facebookCredential);
    
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const authInfo = { signIn, signInWithFacebook };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
