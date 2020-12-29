import { useQuery } from "react-query";
import axios from "axios";

export default function useUser() {
  const queryKey = "user";
  function query() {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/v1/me")
        .then((response) => {
          const { user } = response.data;
          resolve(user);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  const config = {
    retry: 1,
    refetchOnWindowFocus: false,
  };

  return useQuery(queryKey, query, config);
}
