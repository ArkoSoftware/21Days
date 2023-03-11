import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider, 
  signInWithCredential,
  signInWithEmailAndPassword, 
  signOut,
} from "firebase/auth";
import React, { createContext, useEffect } from "react";
import { app } from "../security/firebase";

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    alert('hello')
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const authInfo = { signIn, signInWithGoogle };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
