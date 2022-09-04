import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Loader from "../common/Loader";
import AuthForm from "./AuthForm";
import { motion, transform } from "framer-motion";
import Card from "./Card";
import firestoreContext from "../../context/firestore-context";
import authContext from "../../context/auth-context";

export default function Auth({ isLoggedIn, loading, handleSubmit, type }) {
  const router = useRouter();
  console.log(isLoggedIn);
  const { findUser } = useContext(firestoreContext);
  const { user } = useContext(authContext);

  useEffect(() => {
    if (isLoggedIn && !loading) {
      checkUserInDatabse();
    }
  }, [isLoggedIn]);

  const checkUserInDatabse = async () => {
    if (!(await (await findUser(user.uid)).data())) {
      router.push("/accountDetails");
    } else {
      router.push("/");
    }
  };

  //   if (loading) {
  //     return <Loader />;
  //   }

  const displayPageName = type == 1 ? "Sign up" : "Login";
  let title = `${displayPageName} - Study with buddy`;

  return (
    <Flex
      key={loading}
      bg={"gray.900"}
      w="100vw"
      h="100vh"
      color="white"
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Head>
        <title>{title}</title>
        <meta name="description" content="A group study application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Card>
        <Text
          className="welcome"
          fontFamily={"Poppins, sans-serif"}
          fontSize={["xl", "xl", "2xl", "2xl"]}
          fontWeight={"medium"}
        >
          Welcome to Study with buddy.
        </Text>
        <Text
          className="welcome"
          fontFamily={"Poppins, sans-serif"}
          fontSize={["md", "md", "lg", "lg"]}
          fontWeight={"light"}
          pt={1}
          color={"gray.300"}
        >
          {displayPageName} to get started
        </Text>
        <Box mt={8}>
          <AuthForm
            type={type}
            handleSubmit={async (email, password) => {
              handleSubmit(email, password);
            }}
          />{" "}
          {/* 1 for sign up page 2 for login page */}
        </Box>
      </Card>
    </Flex>
  );
}
