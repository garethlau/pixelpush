import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { setAccessToken } from "../accessToken";

export default function useLogout() {
  const queryClient = useQueryClient();

  function mutate() {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/v1/auth/logout")
        .then((response) => {
          console.log(response);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async function onMutate() {
    await queryClient.cancelQueries("user");

    const snapshot = queryClient.getQueryData("user");

    queryClient.setQueryData("user", null);

    return { snapshot };
  }

  function onError(_0, _1, context) {
    queryClient.setQueryData("user", context.snapshot);
  }

  function onSettled() {
    queryClient.invalidateQueries("user");
    setAccessToken("");
  }

  const config = {
    onMutate,
    onError,
    onSettled,
  };

  return useMutation(mutate, config);
}
