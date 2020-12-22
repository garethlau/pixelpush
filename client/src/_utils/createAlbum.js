import axios from "axios";
export default function createAlbum(data) {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/v1/albums", data)
      .then((response) => {
        const { album } = response.data;
        resolve(album);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
