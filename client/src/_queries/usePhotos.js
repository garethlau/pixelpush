import { useQuery } from "react-query";
import axios from "axios";

export default function usePhotos(albumCode) {
  const queryKey = ["album", albumCode, "photos"];
  function query() {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/v1/albums/${albumCode}/photos`)
        .then((response) => {
          const photos = response.data?.photos;
          resolve(photos);
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
