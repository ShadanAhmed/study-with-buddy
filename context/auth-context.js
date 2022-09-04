import React from "react";

const authContext = React.createContext({
  user: null,
  isLoggedIn: false,
  signUp: () => {},
  loading: true,
  logout: () => {},
  login: () => {},
});

export default authContext;
