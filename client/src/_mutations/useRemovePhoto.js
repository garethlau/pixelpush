import { useMutation } from "react-query";
import { useQueryClient } from "react-query";

import axios from "axios";

export default function useRemovePhoto(albumCode) {
  const queryClient = useQueryClient();
  const queryKey = ["album", albumCode, "photos"];

  function mutate(key) {
    return new Promise((resolve, reject) => {
      if (!albumCode) {
        reject("Missing album code");
      }
      axios
        .delete(`/api/v1/albums/${albumCode}/photos/${key}`)
        .then((response) => {
          console.log(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async function onMutate(key) {
    await queryClient.cancelQueries(queryKey);

    const snapshot = queryClient.getQueryData(queryKey);

    queryClient.setQueryData(queryKey, (oldPhotos) => {
      let newPhotos = oldPhotos.filter((photo) => photo.key !== key);
      return newPhotos;
    });

    return { snapshot };
  }

  function onError(_0, _1, context) {
    // Rollback on error
    queryClient.setQueryData(queryKey, context.snapshot);
  }

  function onSettled() {
    queryClient.invalidateQueries(queryKey);
  }

  const config = {
    onMutate,
    onError,
    onSettled,
  };

  return useMutation(mutate, config);
}
