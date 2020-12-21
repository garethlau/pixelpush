import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function upload(file, config = {}) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    axios
      .post("/api/v1/signed-urls", { key: id })
      .then((response) => {
        const { signedUrl } = response.data;
        axios
          .put(signedUrl, file, config)
          .then((response) => {
            console.log(response);
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}
