import { Button } from "@chakra-ui/react";
import React from "react";

const WideButton = ({ children, onClick }) => {
  return (
    <Button
      variant={"solid"}
      colorScheme={"green"}
      mt={6}
      w={"100%"}
      fontFamily={"Poppins, sans-serif"}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default WideButton;
