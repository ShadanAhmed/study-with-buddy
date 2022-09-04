import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Lottie from "lottie-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import authContext from "../context/auth-context";
import firestoreContext from "../context/firestore-context";
import groupStudyAnimation from "../animation/group-study.json";
import Input from "../components/common/Input";
import { MdKeyboardAlt } from "react-icons/md";
import { AiOutlineClockCircle } from "react-icons/ai";

import Loader from "../components/common/Loader";
import axios from "axios";

export default function Home() {
  const [code, setCode] = useState("");
  const [studyTime, setStudyTime] = useState(20);
  const [discussionTime, setDiscussionTime] = useState(5);
  const { isLoggedIn, loading, logout } = useContext(authContext);
  const { currentUser, createGroupStudy } = useContext(firestoreContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn && !loading) {
      console.log("...");
      router.push("/signUp");
    }
  }, [isLoggedIn, loading]);

  const generateMeetingCode = () => {
    let meetingCode = "";
    const alphabets = "abcdefghijklmnopqrstuvwxyz";
    // generate random alphabet
    for (let i = 1; i <= 3; i++) {
      meetingCode += alphabets[Math.floor(Math.random() * alphabets.length)];
    }
    meetingCode += "-";
    for (let i = 1; i <= 4; i++) {
      meetingCode += alphabets[Math.floor(Math.random() * alphabets.length)];
    }
    meetingCode += "-";
    for (let i = 1; i <= 3; i++) {
      meetingCode += alphabets[Math.floor(Math.random() * alphabets.length)];
    }
    return meetingCode;
  };

  if (loading || !currentUser) {
    return <Loader />;
  }

  return (
    <Box
      bg={"gray.900"}
      w="100vw"
      h="100vh"
      color={"white"}
      fontFamily={"Poppins, sans-serif"}
    >
      <Head>
        <title>Study with buddy | Group study app</title>
        <meta name="description" content="A group study application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex flexDirection="column" h="100%" flex="1 auto" overflow="hidden">
        <Flex
          className="header"
          px={8}
          py="4"
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text fontWeight={"black"} fontSize="xl">
            Study With Buddy
          </Text>
          <Image
            h="48px"
            w="50px"
            objectFit="cover"
            rounded="full"
            src={currentUser.imageUrl}
          />
        </Flex>
        <Flex
          h="100%"
          overflow={"hidden"}
          w="100%"
          p={[3, 6, 12, 24]}
          justifyContent={"space-between"}
          flexDir={{
            base: "column-reverse",
            sm: "column-reverse",
            md: "column-reverse",
            lg: "row",
          }}
        >
          <Flex
            flexDir="column"
            justifyContent={"space-between"}
            w={["100%", "100%", "100%", "50%"]}
            h={{ base: "70%", sm: "70%", md: "70%", lg: "100%" }}
          >
            <Box>
              <Text
                className="welcome"
                fontFamily={"Poppins, sans-serif"}
                fontSize={["2xl", "3xl", "4xl", "5xl"]}
                fontWeight={"black"}
                textAlign={["center", "left", "left", "left"]}
              >
                Group study made simple
              </Text>
              <Text
                className="welcome"
                fontFamily={"Poppins, sans-serif"}
                fontSize={["sm", "md", "lg", "xl"]}
                fontWeight={"light"}
                mt="2"
                textAlign={["center", "justify", "justify", "justify"]}
              >
                Study with buddy is a online group study website so you can
                study with your freinds without having to leave your house.
                Group study always end up in endless discussion and no study.
                which is why study with buddy provides you with seprete interval
                for study and discussion
              </Text>
            </Box>

            <Box>
              <Flex mt={[8, 8, 8, 16]} flex="1, auto">
                <Button
                  variant={"solid"}
                  bg="purple.500"
                  mr="4"
                  p={10}
                  py="6"
                  onClick={async () => {
                    if (studyTime && discussionTime) {
                      if (studyTime > 0 && discussionTime > 0) {
                        const meetingCode = generateMeetingCode();
                        console.log({
                          meetingCode,
                          cur: currentUser,
                          studyTime,
                          discussionTime,
                          date: Date.now(),
                        });
                        await axios.get(
                          `/api/createChannel?meetingCode=${meetingCode}`
                        );
                        await createGroupStudy(
                          meetingCode,
                          currentUser.uid,
                          studyTime,
                          discussionTime,
                          Date.now()
                        );
                        router.push(`/meeting/${meetingCode}`);
                      }
                    }
                  }}
                >
                  Start group study
                </Button>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    router.push(`/meeting/${code}`);
                  }}
                >
                  <Input
                    ml="4"
                    Icon={MdKeyboardAlt}
                    placeholder="Enter group code.."
                    value={code}
                    setValue={setCode}
                    type="text"
                  />
                </form>
              </Flex>
              <Flex mt={8}>
                <Box mr="4" w="60%">
                  <Tooltip label="study-time">
                    <Input
                      Icon={AiOutlineClockCircle}
                      placeholder="Study time in minute"
                      type="number"
                      value={studyTime}
                      setValue={setStudyTime}
                      mr="4"
                    />
                  </Tooltip>
                </Box>
                <Tooltip label="discussion time">
                  <Input
                    Icon={AiOutlineClockCircle}
                    placeholder="Disscussion time in minute"
                    type="number"
                    value={discussionTime}
                    setValue={setDiscussionTime}
                  />
                </Tooltip>
              </Flex>
            </Box>
          </Flex>
          <Box
            h={["50%", "40%", "50%", "100%"]}
            w={["100%", "100%", "100%", "50%"]}
          >
            <Lottie
              style={{ height: "100%", width: "100%" }}
              // style={{ transform: "scale(.8)" }}
              animationData={groupStudyAnimation}
              loop={true}
            />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
