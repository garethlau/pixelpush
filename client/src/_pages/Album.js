import React, { useEffect, useCallback, useContext, useState } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import { useSnackbar } from "notistack";
import { AnimatePresence, motion } from "framer-motion";
// Contexts
import { UploadQueueContext } from "../_contexts/uploadQueue";
import { UploadProgressContext } from "../_contexts/uploadProgress";
// Queries
import useAlbum from "../_queries/useAlbum";
import useAuthedUser from "../_queries/useAuthedUser";
import usePhotos from "../_queries/usePhotos";
import useUser from "../_queries/useUser";
// Mutations
import useDeleteAlbum from "../_mutations/useDeleteAlbum";
// Components
import Button from "../_components/Button";
import UploadQueue from "../_components/UploadQueue";
import Photo from "../_components/Photo";
import PhotoDetails from "../_components/PhotoDetails";
import DoesNotExistModal from "../_components/DoesNotExistModal";
// Utils
import upload from "../_utils/upload";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    overflowX: "hidden",
  },
  content: {
    maxWidth: "960px",
    margin: "auto",
    marginBottom: "150px",
  },
  info: {
    margin: "30px 0",
  },
  uploadBtn: {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  empty: {},
}));

function isValidType(file) {
  const type = file.type;
  const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/jpg"];
  return validImageTypes.includes(type);
}

export default function Album() {
  const classes = useStyles();
  const { albumCode } = useParams();
  const { data: album, isLoading: loadingAlbum } = useAlbum(albumCode);
  const { data: photos, refetch: refetchPhotos } = usePhotos(albumCode);
  const { uploadQueue } = useContext(UploadQueueContext);
  const { setProgress } = useContext(UploadProgressContext);
  const { data: user } = useAuthedUser();
  const { data: creator } = useUser(album?.createdBy);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();
  const location = useLocation();
  const { mutateAsync: _deleteAlbum, isLoading: isDeleting } = useDeleteAlbum(
    albumCode
  );
  const [dne, setDne] = useState(false);

  useEffect(() => {
    // Check if the album exists
    if (!loadingAlbum && !album) {
      setDne(true);
    }
  }, [album, loadingAlbum]);

  useEffect(async () => {
    if (uploadQueue.size() > 0) {
      const file = uploadQueue.peek();
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

  async function deleteAlbum() {
    try {
      await _deleteAlbum();
      enqueueSnackbar("Album deleted. Redirecting you to the home page.", {
        variant: "success",
      });
      setTimeout(() => {
        closeSnackbar();
        history.push("/");
      }, 3000);
    } catch (error) {
      enqueueSnackbar("There was an error. Please try again.", {
        variant: "error",
      });
    }
  }

  const onDrop = useCallback(async (droppedFiles) => {
    const acceptedFiles = droppedFiles.filter(isValidType).map((file) => {
      // Generate a key for each file
      const key = uuidv4();
      file.key = key;

      return file;
    });
    uploadQueue.enqueueMany(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <React.Fragment>
      <UploadQueue />
      <PhotoDetails />
      <DoesNotExistModal open={dne} />
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.info}>
            <Typography variant="caption">{albumCode}</Typography>
            <Typography variant="h1">
              {album ? album.title : <Skeleton width={400} />}
            </Typography>
            <Typography variant="h5">
              {album ? (
                new Date(album.date).toLocaleDateString()
              ) : (
                <Skeleton width={500} />
              )}
            </Typography>
            {creator ? (
              <React.Fragment>
                {album.createdBy === user?._id ? (
                  <div>
                    <Typography variant="h5">
                      You created this album on{" "}
                      {new Date(album.createdAt).toLocaleDateString()}
                    </Typography>
                    <Button
                      onClick={deleteAlbum}
                      variant="contained"
                      color="secondary"
                      isLoading={isDeleting}
                    >
                      Delete
                    </Button>
                  </div>
                ) : (
                  <Typography variant="h5">
                    {"Created by " +
                      creator?.firstName +
                      " " +
                      creator?.lastName +
                      " on " +
                      new Date(album.createdAt).toLocaleDateString()}
                  </Typography>
                )}
              </React.Fragment>
            ) : (
              <Typography variant="h5">
                <Skeleton width={300} />
              </Typography>
            )}
          </div>

          <div>
            {photos?.length === 0 ? (
              <div className={classes.empty}>
                <Typography variant="body1">
                  This album does not have any photos yet.
                </Typography>
              </div>
            ) : (
              <AnimatePresence>
                {photos?.map((photo) => (
                  <Photo photo={photo} key={photo.key} />
                ))}
              </AnimatePresence>
            )}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!!user ? (
              <div className={classes.uploadBtn} {...getRootProps()}>
                <input {...getInputProps()} />
                <Button
                  variant="contained"
                  color="primary"
                  isLoading={uploadQueue.size() > 0}
                >
                  Upload
                </Button>
              </div>
            ) : (
              <div className={classes.uploadBtn}>
                <Button
                  onClick={() => {
                    enqueueSnackbar("Please log in to add images.", {
                      variant: "default",
                      action: (key) => (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            closeSnackbar(key);
                            let pathname = location.pathname;
                            history.push("/login?redirect=" + pathname);
                          }}
                        >
                          Log in
                        </Button>
                      ),
                    });
                  }}
                  variant="contained"
                  color="primary"
                >
                  Upload
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </React.Fragment>
  );
}
