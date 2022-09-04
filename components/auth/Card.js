import React from "react";
import { motion } from "framer-motion";
import { Box } from "@chakra-ui/react";

const Card = ({ children }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: {
          // translateX: "-50vw",
          opacity: 0,
        },
        visible: {
          // translateX: 0,
          opacity: 1,
          transition: {
            delay: 0.4,
          },
        },
      }}
    >
      <Box
        bg={"gray.800"}
        w={["90vw", "70vw", "50vw", "30vw"]}
        p={8}
        rounded="lg"
        shadow={"md"}
        fontFamily={"Poppins, sans-serif"}
      >
        {children}
      </Box>
    </motion.div>
  );
};

export default Card;
