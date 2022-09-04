import React, { useState } from "react";

import { Box, Button, Link, Text } from "@chakra-ui/react";

import { MdEmail, MdPassword } from "react-icons/md";
import NextLink from "next/link";
import Input from "../common/Input";
import WideButton from "../common/WideButton";

const AuthForm = ({ type, handleSubmit }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  return (
    <>
      <Input
        type="email"
        value={email}
        setValue={setEmail}
        placeholder="Email address"
        Icon={MdEmail}
      />
      <Box mt={4}>
        <Input
          type="password"
          value={password}
          setValue={setPassword}
          placeholder="Password"
          Icon={MdPassword}
        />
      </Box>

      <WideButton onClick={() => handleSubmit(email, password)}>
        {type == 1 ? <> Sign up </> : <> Login </>}
      </WideButton>
      <Text
        className="welcome"
        fontSize={["sm", "sm", "md", "md"]}
        fontWeight={"medium"}
        pt={4}
        color={"gray.300"}
        textAlign={"center"}
      >
        {type == 1 ? (
          <>
            Already have an account{" "}
            <NextLink href="/login" passHref>
              <Link display={"inline"} color={"blue.300"}>
                login
              </Link>
            </NextLink>
          </>
        ) : (
          <>
            Don&apos;t have an account{" "}
            <NextLink href="/signUp" passHref>
              <Link display={"inline"} color={"blue.300"}>
                sign-up
              </Link>
            </NextLink>
          </>
        )}
      </Text>
    </>
  );
};

export default AuthForm;
