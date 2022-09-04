import { CollectionReference, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";

export default function useFirestore(currentUserId, isLoggedIn) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      changeCurrentUser();
    }
  }, [isLoggedIn]);

  const changeCurrentUser = async () => {
    setCurrentUser(
      await (await getDoc(doc(db, "users", currentUserId))).data()
    );
  };

  const findUser = async (userId) => {
    return getDoc(doc(db, "users", userId));
  };

  const createUserInDatabase = async (uid, email, name, imageUrl) => {
    setCurrentUser(
      await (
        await setDoc(doc(db, "users", uid), { email, name, imageUrl, uid })
      ).data()
    );
  };

  const createGroupStudy = (
    meetingCode,
    createdBy,
    studyTime,
    discussionTime,
    timestamp
  ) => {
    return setDoc(doc(db, "group-study", meetingCode), {
      meetingCode,
      createdBy,
      studyTime,
      discussionTime,
      timestamp,
    });
  };

  const findGroupStudy = (meetingCode) => {
    return getDoc(doc(db, "group-study", meetingCode));
  };

  return {
    findUser,
    createUserInDatabase,
    currentUser,
    setCurrentUser,
    createGroupStudy,
    findGroupStudy,
  };
}
