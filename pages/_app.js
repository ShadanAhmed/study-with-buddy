import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import AuthContext from "../context/auth-context";
import FirestoreContext from "../context/firestore-context";
import useAuth from "../hooks/useAuth";
import useFirestore from "../hooks/useFirestore";
import { extendTheme } from "@chakra-ui/react";
import { hop } from "@onehop/client";
import { useEffect } from "react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

function MyApp({ Component, pageProps }) {
  const auth = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    console.log("what the?");
    console.log(
      hop.init({
        projectId: "project_NDk4MjIzNTI2NTU4NTk4MDc", // replace with your project ID
      })
    );
  }, []);

  return (
    <FirestoreContext.Provider
      value={useFirestore(auth.user?.uid || null, auth.isLoggedIn)}
    >
      <AuthContext.Provider value={auth}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </AuthContext.Provider>
    </FirestoreContext.Provider>
  );
}

export default MyApp;
