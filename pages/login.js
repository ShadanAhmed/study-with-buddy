import { useContext } from "react";
import Auth from "../components/auth/Auth";
import authContext from "../context/auth-context";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const { isLoggedIn, loading, login } = useContext(authContext);

  return (
    <Auth
      isLoggedIn={isLoggedIn}
      loading={loading}
      handleSubmit={async (email, password) => {
        login(email, password);
      }}
      //  1 for signUp 2 for login
      type={2}
    />
  );
}
