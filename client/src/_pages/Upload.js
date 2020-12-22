import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import useQueue from "../_hooks/useQueue";
// uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
import upload from "../_utils/upload";

export default function Upload() {
  const uploadQueue = useQueue([]);

  useEffect(async () => {
    if (uploadQueue.size() > 0) {
      const file = uploadQueue.peek();
      console.log("Begin Uploading ", file.name);
      await upload(file, { onUploadProgress: (event) => console.log(event) });
      console.log("Done uploading ", file.name);
      uploadQueue.dequeue();
    }
  }, [uploadQueue]);

  const onDrop = useCallback(async (acceptedFiles) => {
    // Do something with the files
    uploadQueue.enqueueMany(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <h1>Upload Area</h1>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <h1>Queue</h1>
      <div>
        {uploadQueue.values?.map((file) => (
          <p>
            {file.name} {file.size}
          </p>
        ))}
      </div>
    </div>
  );
}
