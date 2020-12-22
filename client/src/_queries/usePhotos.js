import { useQuery } from "react-query";
import axios from "axios";

export default function usePhotos(albumCode) {
  const queryKey = ["album", albumCode, "photos"];
  function query() {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/v1/albums/${albumCode}/photos`)
        .then((response) => {
          const urls = response.data?.urls;
          resolve(urls);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  const config = {
    enabled: !!albumCode,
  };

  return useQuery(queryKey, query, config);
}
