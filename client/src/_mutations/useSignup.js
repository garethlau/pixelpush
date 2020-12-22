import { useMutation, QueryClient } from "react-query";
import axios from "axios";
import { setAccessToken } from "../accessToken";

export default function useSignup() {
  const queryClient = new QueryClient();

  function mutate({ email, password, firstName, lastName }) {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    return new Promise((resolve, reject) => {
      axios
        .post("/api/v1/auth/signup", data)
        .then((response) => {
          const { data } = response;
          const { accessToken, user } = data;
          setAccessToken(accessToken);
          resolve(user);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  function onSuccess(data) {
    queryClient.setQueryData("user", data);
  }

  const config = {
    onSuccess,
  };

  return useMutation(mutate, config);
}
