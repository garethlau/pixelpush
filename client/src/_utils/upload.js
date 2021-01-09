import axios from "axios";

export default function upload(albumCode, file, config = {}) {
  return new Promise((resolve, reject) => {
    const key = file.key;
    // Get signed url
    axios
      .post("/api/v1/signed-urls", { key })
      .then((response) => {
        const { signedUrl } = response.data;
        // Upload to aws s3
        axios
          .put(signedUrl, file, config)
          .then((response) => {
            // Attach file object to album
            const { type, name, size } = file;
            axios
              .put(`/api/v1/albums/${albumCode}/photos`, {
                key,
                type,
                name,
                size,
              })
              .then((response) => {
                resolve(response);
              })
              .catch((error) => {
                reject(error);
              });
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
