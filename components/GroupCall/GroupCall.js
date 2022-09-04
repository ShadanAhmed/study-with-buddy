import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import firestoreContext from "../../context/firestore-context";
import authContext from "../../context/auth-context";

import useAgora from "../../hooks/useAgora";
import AgoraRTC from "agora-rtc-sdk-ng";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Icon,
  Image,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import Loader from "../common/Loader";
import Agora, { RtcTokenBuilder } from "agora-access-token";
import MediaPlayer from "./MediaPlayer";
import {
  MdChat,
  MdClose,
  MdContentCopy,
  MdInfo,
  MdInfoOutline,
  MdLockClock,
  MdMic,
  MdMicOff,
  MdOutlineCallEnd,
  MdOutlinePersonOutline,
  MdPeople,
  MdPeopleOutline,
} from "react-icons/md";
import { AiOutlineClockCircle, AiOutlineInfoCircle } from "react-icons/ai";
import {
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
  BsPeople,
} from "react-icons/bs";
import axios from "axios";
import { useReadChannelState } from "@onehop/react";
import { async } from "@firebase/util";

const client = AgoraRTC.createClient({ codec: "h264", mode: "rtc" });

const GroupCall = () => {
  const { currentUser, findUser, findGroupStudy, createGroupStudy } =
    useContext(firestoreContext);
  const {
    join,
    localVideoTrack,
    localAudioTrack,
    joinState,
    toggleMic,
    toggleVideo,
    remoteUsers,
    leave,
  } = useAgora(client);
  const router = useRouter();
  const toast = useToast();
  const [showBottomDialog, setShowBottomDialog] = useState(true);
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const [phase, setPhase] = useState(1); // 1 for invition 2 for discussion 3 for study
  const [meeting, setMeeting] = useState(null);
  const [counterString, setConterString] = useState("5:00");
  const { state, error, subscription } = useReadChannelState(
    router.query.meetingCode
  );
  const [users, setUsers] = useState([]);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    console.log("I am use effect!!!");
    console.log({ connectingState: client.connectingState });
    joinMeeting();
  }, []);

  const updateChannel = async (phase, countdownString) => {
    const response = await axios.post(
      `/api/updateChannelState?channel=${router.query.meetingCode}`,
      { phase, countdownString }
    );
    console.log(response);
  };

  useEffect(() => {
    updateChannel(phase, counterString);
  }, [phase, counterString]);

  let stringUpdateTimer;
  let phaseUpdateTimer;
  useEffect(() => {
    if (!meeting) return;
    if ((phase == 2 || phase == 3) && meeting.createdBy == currentUser.uid) {
      let phaseDiscussion = phase == 2;
      let discussionTime = meeting.discussionTime;
      let studyTime = meeting.studyTime;
      setConterString(
        phaseDiscussion ? `${discussionTime}:00` : `${studyTime}:00`
      );
      let timeAhead = new Date(
        new Date().getTime() +
          (phaseDiscussion ? discussionTime : studyTime) * 60000
      ).getTime();
      stringUpdateTimer = setInterval(() => {
        let timeCurrent = new Date().getTime();
        let dist = timeAhead - timeCurrent;

        let min = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        let sec = Math.floor((dist % (1000 * 60)) / 1000);
        setConterString(`${min}:${sec}`);
      }, 1000);
      phaseUpdateTimer = setTimeout(
        () => {
          setPhase(phaseDiscussion ? 3 : 2);
        },
        phaseDiscussion ? discussionTime * 60 * 1000 : studyTime * 60 * 1000
      );
    }

    if (state) {
      if (state.phase == 3 && audio) {
        // client.unpublish();
        // client.publish([localVideoTrack]);
        unpublishAudio(true);
        toggleMic();
        setAudio(false);
      }
    }

    return () => {
      if (stringUpdateTimer) clearTimeout(stringUpdateTimer);
      if (phaseUpdateTimer) clearTimeout(phaseUpdateTimer);
    };
  }, [phase, meeting]);

  const joinMeeting = async () => {
    const meetingCode = router.query.meetingCode;
    const meeting = (await findGroupStudy(meetingCode)).data();
    console.log({ meeting });
    setMeeting(meeting);

    console.log({ connectionState: client.connectionState });

    const expiresAt = Math.floor(Date.now() / 1000) + 2 * 60 * 60;

    const token = RtcTokenBuilder.buildTokenWithUid(
      "ffa0bd72bca4474c8a8c65ddc2880b17",
      meeting.createdBy == currentUser.uid
        ? "a6be11efd3a2483b890484dc08c4a6b3"
        : "44273245898c4e0abfa42aeb6e8848d9",
      meetingCode,
      currentUser.uid,
      meeting.createdBy == currentUser.uid
        ? Agora.RtcRole.PUBLISHER
        : Agora.RtcRole.SUBSCRIBER,
      expiresAt
    );
    await join(
      "ffa0bd72bca4474c8a8c65ddc2880b17",
      token,
      meetingCode,
      currentUser.uid
    );
  };

  useEffect(() => {
    console.log({ localVideoTrack, currentUser, remoteUsers });
    if (remoteUsers.length > 0 && phase == 1) {
      setPhase(2);
    }
    setUsers([
      {
        uid: currentUser.uid,
        videoTrack: localVideoTrack,
        audioTrack: null,
      },
      ...remoteUsers,
    ]);
  }, [remoteUsers]);

  useEffect(() => {
    for (let user of users) {
      const foundUser = usersData.find((e) => e.uid == user.uid);
      if (!foundUser) {
        addUserData(user);
      }
    }
  }, [users]);

  const addUserData = async (user) => {
    // console.log({ user });
    let userData = await (await findUser(user.uid)).data();
    setUsersData([...usersData, userData]);
  };

  // if (!state) {
  //   return <Loader />;
  // }

  const unpublishAudio = async (audio) => {
    if (audio) {
      await client.unpublish();
      await client.publish([localVideoTrack]);
    } else {
      await client.publish([localAudioTrack, localVideoTrack]);
    }
  };

  console.log({ state, error, subscription });

  if (!state) {
    console.log({ channel: router.query.channel });
    return <Loader />;
  }

  return (
    <Box
      bg="gray.900"
      w="100vw"
      h="100vh"
      p="8"
      fontFamily={"Poppins, sans-serif"}
    >
      <div
        className="call-grid"
        data-grid={users.length}
        style={{ position: "relative" }}
      >
        {showBottomDialog && (
          <Box
            position={"absolute"}
            left="0"
            bottom="0"
            w="350px"
            borderRadius="lg"
            bg={"gray.700"}
            zIndex="100"
            p="6"
            color="gray.200"
          >
            <Flex justifyContent="space-between" alignItems={"center"}>
              <Text fontSize="lg"> Your meeting&apos;s ready</Text>
              <Icon
                boxSize={"6"}
                as={MdClose}
                onClick={() => setShowBottomDialog(false)}
              />
            </Flex>
            <Text mt="4">
              Share this link with others you want in the meeting
            </Text>
            <Flex
              mt="4"
              p="2"
              bg="gray.600"
              w="100%"
              borderRadius={"md"}
              alignItems="center"
              justifyContent="space-between"
            >
              <Text fontSize={"sm"}>
                http://localhost:3000/meeting/{router.query.meetingCode}
              </Text>
              <Icon
                as={MdContentCopy}
                onClick={() => {
                  const input = document.createElement("input");
                  input.value = ` http://localhost:3000/meeting/${router.query.meetingCode}`;
                  document.body.appendChild(input);
                  input.select();
                  input.setSelectionRange(0, 99999);
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(input.value);
                  }
                  document.body.removeChild(input);
                  toast({
                    title: "Copied to clipboard!",
                    status: "info",
                    duration: 2000,
                    isClosable: true,
                    position: "bottom-left",
                  });
                }}
              />
            </Flex>
          </Box>
        )}
        {users.map((user) => {
          console.error(user.videoTrack);
          return (
            <>
              <Box position={"relative"}>
                <MediaPlayer
                  key={user.uid}
                  videoTrack={
                    user.uid == currentUser.uid
                      ? video
                        ? localVideoTrack
                        : null
                      : user.videoTrack
                  }
                  audioTrack={user.audioTrack}
                />
                <Image
                  visibility={
                    user.uid == currentUser.uid
                      ? video
                        ? "hidden"
                        : "visible"
                      : !user.videoTrack
                      ? "visible"
                      : "hidden"
                  }
                  h="150"
                  w="150"
                  rounded="full"
                  position="absolute"
                  left="50%"
                  top="50%"
                  translate="-50%, -50%"
                  src={
                    user.uid == currentUser.uid
                      ? currentUser.imageUrl
                      : usersData.find((e) => e.uid == user.uid)?.imageUrl ||
                        null
                  }
                />

                <Text
                  textColor={"white"}
                  position="absolute"
                  bottom={2}
                  left={2}
                >
                  {user.uid == currentUser.uid
                    ? currentUser.name
                    : usersData.find((e) => e.uid == user.uid)?.name || null}
                </Text>
              </Box>
              {/* <Text color={"white"}>{user.userId}</Text> */}
            </>
          );
        })}
      </div>
      <Flex
        w="100%"
        mt="2"
        h="12%"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Flex alignItems={"center"} width="50%">
          <Box
            boxSize={2}
            bg={
              state.phase == 1
                ? "yellow.400"
                : state.phase == 2
                ? "green.400"
                : "red.400"
            }
            rounded="full"
            mr="2"
          ></Box>
          <Text color={"white"} fontWeight="bold" fontSize={"lg"}>
            {state.phase == 1
              ? "Invitation"
              : state.phase == 2
              ? "Discussion"
              : "Study"}{" "}
            time{" "}
            {state.phase == 2 || state.phase == 3
              ? `- ${state.countdownString}`
              : ""}
          </Text>
        </Flex>
        <Flex w="50%" justifyContent="end">
          <Flex
            boxSize="10"
            bg="gray.700"
            ml="2"
            rounded={"full"}
            alignItems="center"
            justifyContent="center"
            onClick={async () => {
              if (!(state.phase == 3)) {
                await toggleMic();
                unpublishAudio(audio);
                setAudio(!audio);
              }
            }}
          >
            <Icon as={!audio ? MdMicOff : MdMic} boxSize="6" color={"white"} />
          </Flex>
          <Flex
            boxSize="10"
            bg="gray.700"
            ml="4"
            rounded={"full"}
            alignItems="center"
            justifyContent="center"
            onClick={async () => {
              await toggleVideo();
              setVideo(!video);
              if (video) {
                await client.unpublish();
                await client.publish([localAudioTrack]);
              } else {
                await client.publish([localVideoTrack, localAudioTrack]);
              }
            }}
          >
            <Icon
              as={video ? BsFillCameraVideoFill : BsFillCameraVideoOffFill}
              boxSize="6"
              color={"white"}
            />
          </Flex>
          <Flex
            boxSize="10"
            bg="gray.700"
            ml="4"
            rounded={"full"}
            alignItems="center"
            justifyContent="center"
            onClick={async () => {
              await leave();
              router.push("/");
            }}
          >
            <Icon as={MdOutlineCallEnd} boxSize="6" color={"white"} />
          </Flex>
        </Flex>
        {/* <Flex w="20%" alignItems={"center"} justifyContent="right">
          <Icon as={MdInfoOutline} boxSize={7} color="white" mr="4" />
          <Icon as={MdOutlinePersonOutline} boxSize={7} color="white" mr="4" />
          <Tooltip label="Start timer" placement="bottom">
            <Icon as={MdChat} boxSize={7} color="white" />
          </Tooltip>
        </Flex> */}
      </Flex>
    </Box>
  );
};

export default GroupCall;
