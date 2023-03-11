import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { createContext } from "react";
import { app } from "../security/firebase";

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const authInfo = { signIn };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
