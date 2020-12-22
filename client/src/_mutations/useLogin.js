import { useMutation, QueryClient } from "react-query";
import axios from "axios";
import { setAccessToken } from "../accessToken";

export default function useLogin() {
  const queryClient = new QueryClient();

  function mutate({ email, password }) {
    const data = { email, password };
    return new Promise((resolve, reject) => {
      axios
        .post("/api/v1/auth/login", data)
        .then((response) => {
          const { data } = response;
          const { accessToken, user } = data;
          setAccessToken(accessToken);
          resolve(user);
        })
        .catch((error) => {
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
