import { Flex, Spinner } from "@chakra-ui/react";
import React from "react";

const Loader = () => {
  return (
    <Flex
      bg={"gray.900"}
      w="100vw"
      h="100vh"
      color="white"
      justifyContent={"center"}
      alignItems={"center"}
    >
      {" "}
      <Spinner
        color="green.500"
        size={"xl"}
        thickness="4px"
        speed="0.65s"
      />{" "}
    </Flex>
  );
};

export default Loader;
