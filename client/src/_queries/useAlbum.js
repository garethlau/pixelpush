import axios from "axios";
import { useQuery } from "react-query";

export default function useAlbum(albumCode) {
  const queryKey = ["album", albumCode];
  function query() {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/v1/albums/${albumCode}`)
        .then((response) => {
          const { album } = response.data;
          resolve(album);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  const config = {
    enabled: !!albumCode,
    retry: false,
  };

  return useQuery(queryKey, query, config);
}
