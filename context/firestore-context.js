import React from "react";

const firestoreContext = React.createContext({
  findUser: () => {},
  createUserInDatabase: () => {},
  currentUser: null,
  setCurrentUser: () => {},
  createGroupStudy: (
    meetingCode,
    createdBy,
    studyTime,
    discussionTime,
    timestamp
  ) => {},
  findGroupStudy: (meetingCode) => {},
});

export default firestoreContext;
