import { Box, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { MdPeople } from "react-icons/md";
import Card from "../components/auth/Card";
import Input from "../components/common/Input";
import WideButton from "../components/common/WideButton";
import authContext from "../context/auth-context";
import firestoreContext from "../context/firestore-context";
import useFirestore from "../hooks/useFirestore";

const accountDetails = () => {
  const [name, setName] = useState("");
  const { createUserInDatabase } = useContext(firestoreContext);
  const { user } = useContext(authContext);
  const router = useRouter();

  return (
    <Flex
      bg={"gray.900"}
      w="100vw"
      h="100vh"
      color="white"
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Card>
        <Text
          className="welcome"
          fontFamily={"Poppins, sans-serif"}
          fontSize={"xl"}
          fontWeight={"medium"}
          pb={4}
        >
          What everybody should call you.
        </Text>
        <Input
          Icon={MdPeople}
          placeholder="Name"
          value={name}
          setValue={setName}
          type={"text"}
        />
        <WideButton
          onClick={async () => {
            await createUserInDatabase(
              user.uid,
              user.email,
              name,
              `https://avatars.dicebear.com/api/initials/${name}.png`
            );
            router.push("/");
          }}
        >
          Submit
        </WideButton>
      </Card>
    </Flex>
  );
};

export default accountDetails;
