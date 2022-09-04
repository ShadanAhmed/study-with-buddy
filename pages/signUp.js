import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Auth from "../components/auth/Auth";
import Loader from "../components/common/Loader";
import authContext from "../context/auth-context";
import firestoreContext from "../context/firestore-context";
import useAuth from "../hooks/useAuth";

export default function SignUp() {
  const { isLoggedIn, loading, signUp, user } = useContext(authContext);
  const { findUser } = useContext(firestoreContext);
  const router = useRouter();

  const navigate = async () => {
    if (await (await findUser(user.uid)).data()) {
      router.push("/");
    } else {
      router.push("/accountDetails");
    }
  };

  if (loading) {
    return <Loader />;
  } else if (isLoggedIn) {
    navigate();
  } else {
    return (
      <Auth
        isLoggedIn={isLoggedIn}
        loading={loading}
        handleSubmit={async (email, password) => {
          await signUp(email, password);
          router.push("/accountDetails");
        }}
        //   1 for signUp 2 for login
        type={1}
      />
    );
  }
}
