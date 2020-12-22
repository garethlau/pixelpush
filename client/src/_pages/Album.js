import React, { useEffect, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useDropzone } from "react-dropzone";
import { QueryClient } from "react-query";

import { v4 as uuidv4 } from "uuid";

import Typography from "@material-ui/core/Typography";

import useAlbum from "../_queries/useAlbum";
// import useUpload from "../_mutations/useUpload";
import usePhotos from "../_queries/usePhotos";

import upload from "../_utils/upload";
import useQueue from "../_hooks/useQueue";

import Button from "../_components/Button";
import UploadQueue from "../_components/UploadQueue";

import { UploadQueueContext } from "../_contexts/uploadQueue";
import { UploadProgressContext } from "../_contexts/uploadProgress";
import Photo from "../_components/Photo";
import useUser from "../_queries/useUser";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
  },
  content: {
    maxWidth: "960px",
    margin: "auto",
  },
  uploadBtn: {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

function isValidType(file) {
  const type = file.type;
  const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/jpg"];
  return validImageTypes.includes(type);
}

export default function Album() {
  const classes = useStyles();
  const { albumCode } = useParams();
  const { data: album } = useAlbum(albumCode);
  // const uploadQueue = useQueue([]);
  // const { mutateAsync: upload } = useUpload(albumCode);
  const { data: photos, refetch: refetchPhotos } = usePhotos(albumCode);
  const { uploadQueue } = useContext(UploadQueueContext);
  const { progress, setProgress } = useContext(UploadProgressContext);
  const { data: user } = useUser();
  const queryClient = new QueryClient();

  useEffect(() => {
    console.log(album);
  }, [album]);

  useEffect(async () => {
    if (uploadQueue.size() > 0) {
      const file = uploadQueue.peek();
      console.log("Begin Uploading ", file.name);
      await upload(albumCode, file, {
        onUploadProgress: ({ loaded, total }) => {
          setProgress(loaded / total);
        },
      });
      setProgress(0);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      refetchPhotos();
      uploadQueue.dequeue();
    }
  }, [uploadQueue]);

  const onDrop = useCallback(async (droppedFiles) => {
    // Do something with the files

    const acceptedFiles = droppedFiles.filter(isValidType).map((file) => {
      // Generate a key for each file
      const key = uuidv4();
      file.key = key;

      // Generate dimensions for the image
      const objectURL = URL.createObjectURL(file);

      return file;
    });

    console.log(acceptedFiles);

    uploadQueue.enqueueMany(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <React.Fragment>
      <UploadQueue />
      <div className={classes.root}>
        <div className={classes.content}>
          {albumCode}

          <div>
            <Typography variant="h1">Photos</Typography>
            {photos?.map((photo, index) => (
              <Photo photo={photo} key={index} />
            ))}
          </div>

          {!!user && (
            <div className={classes.uploadBtn} {...getRootProps()}>
              <input {...getInputProps()} />
              <Button variant="contained" color="primary">
                Upload
              </Button>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
