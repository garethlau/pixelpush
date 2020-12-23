import axios from "axios";
import { useMutation } from "react-query";

export default function useDeleteAlbum(albumCode) {
  function mutate() {
    return new Promise((resolve, reject) => {
      axios
        .delete(`/api/v1/albums/${albumCode}`)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  const config = {};

  return useMutation(mutate, config);
}
