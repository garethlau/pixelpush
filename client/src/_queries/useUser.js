import { useQuery } from "react-query";
import axios from "axios";

export default function useUser(userId) {
  const queryKey = ["users", userId];

  function query() {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/v1/users/${userId}`)
        .then((response) => {
          const { user } = response.data;
          console.log(user);
          resolve(user);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  const config = { enabled: !!userId };

  return useQuery(queryKey, query, config);
}
