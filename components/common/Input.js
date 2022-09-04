import {
  InputGroup,
  InputLeftElement,
  Input as ChakraInput,
} from "@chakra-ui/react";
import React from "react";

const Input = ({ value, setValue, placeholder, type, Icon }) => {
  console.log(value);
  return (
    <InputGroup size="lg">
      <InputLeftElement pointerEvents="none">
        <Icon color="gray.300" />
      </InputLeftElement>
      <ChakraInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fontFamily={"Poppins, sans-serif"}
      />
    </InputGroup>
  );
};

export default Input;
