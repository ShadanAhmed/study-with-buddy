import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../utils/firebase";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dispose = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        setLoading(false);
      } else {
        // User is signed out
        // ...
        console.log("yes");
        setUser(null);
        setIsLoggedIn(false);
        setLoading(false);
      }
    });
    return () => dispose();
  }, []);

  const signUp = async (email, password) => {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password);
    console.log(auth.currentUser);
    setUser(auth.currentUser);
    setLoading(false);
  };

  const login = async (email, password) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password);
    console.log(auth.currentUser);
    setUser(auth.currentUser);
    setLoading(false);
    setIsLoggedIn(true);
    setLoading(false);
  };

  const logout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setUser(null);
  };
  return {
    signUp,
    user,
    isLoggedIn,
    loading,
    logout,
    login,
  };
}
