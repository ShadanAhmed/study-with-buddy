import React, { useContext, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Loader from "../../components/common/Loader";
import firestoreContext from "../../context/firestore-context";
import authContext from "../../context/auth-context";

const GroupCall = dynamic(
  () => import("../../components/GroupCall/GroupCall"),
  {
    ssr: false,
  }
);

const GroupStudy = () => {
  const router = useRouter();

  const { currentUser } = useContext(firestoreContext);

  const { loading, isLoggedIn } = useContext(authContext);
  useEffect(() => {
    if (!isLoggedIn && !loading) {
      router.push("/signUp");
    }
  }, [isLoggedIn, loading]);

  if (loading || !currentUser) {
    return <Loader />;
  }
  return (
    <>
      <GroupCall h="300px" />
    </>
  );
};

export default GroupStudy;

export async function getServerSideProps(context) {
  return { props: {} };
}
