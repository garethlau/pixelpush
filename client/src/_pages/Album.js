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
import { ShareModalContext } from "../_contexts/shareModal";
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
import ProfileCoin from "../_components/ProfileCoin";
// Utils
import upload from "../_utils/upload";
import { formatDate } from "../_utils/formatter";

const EventTypes = {
  IMAGE_LIST_UPDATED: "IMAGE_LIST_UPDATED",
  ALBUM_DELETED: "ALBUM_DELETED",
};

const EVENT_SOURCE_URL =
  process.env.NODE_ENV === "production"
    ? "https://pixelpush.garethdev.space"
    : "http://localhost:5000";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    overflowX: "hidden",
  },
  content: {
    maxWidth: "960px",
    [theme.breakpoints.down("md")]: {
      width: "90vw",
    },
    margin: "auto",
    marginBottom: "150px",
    position: "relative",
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
  const { setProgress, startProgress, completeProgress } = useContext(
    UploadProgressContext
  );
  const { open: openShareModal } = useContext(ShareModalContext);
  const { data: user } = useAuthedUser();
  const { data: creator } = useUser(album?.createdBy);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();
  const location = useLocation();
  const { mutateAsync: _deleteAlbum, isLoading: isDeleting } = useDeleteAlbum(
    albumCode
  );
  const [dne, setDne] = useState(false);

  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening && albumCode) {
      const events = new EventSource(
        EVENT_SOURCE_URL + "/subscribe/" + albumCode
      );
      events.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.event) {
          if (data.event === EventTypes.IMAGE_LIST_UPDATED) {
            refetchPhotos();
          } else if (data.event === EventTypes.ALBUM_DELETED) {
            enqueueSnackbar(
              "This album has been deleted. Redirecting you to the home page.",
              { variant: "default" }
            );
            setTimeout(() => {
              closeSnackbar();
              history.push("/");
            }, 3000);
          }
        }
      };

      setListening(true);
    }
  }, [
    listening,
    albumCode,
    album,
    user,
    enqueueSnackbar,
    closeSnackbar,
    history,
    refetchPhotos,
  ]);

  useEffect(() => {
    // Check if the album exists
    if (!loadingAlbum && !album) {
      setDne(true);
    }
  }, [album, loadingAlbum]);

  useEffect(() => {
    (async function () {
      if (uploadQueue.size() > 0) {
        const file = uploadQueue.peek();
        startProgress(file.key);
        await upload(albumCode, file, {
          onUploadProgress: ({ loaded, total }) => {
            setProgress(file.key, loaded, total);
          },
        });
        completeProgress(file.key);
        refetchPhotos();
        uploadQueue.dequeue();
      }
    })();
  }, [uploadQueue, albumCode]);

  async function deleteAlbum() {
    try {
      await _deleteAlbum();
    } catch (error) {
      enqueueSnackbar("There was an error. Please try again.", {
        variant: "error",
      });
    }
  }

  const onDrop = useCallback(
    async (droppedFiles) => {
      const acceptedFiles = droppedFiles.filter(isValidType).map((file) => {
        // Generate a key for each file
        const key = uuidv4();
        file.key = key;

        return file;
      });
      uploadQueue.enqueueMany(acceptedFiles);
    },
    [uploadQueue]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <React.Fragment>
      <UploadQueue />
      <PhotoDetails />
      <DoesNotExistModal open={dne} />
      <div className={classes.root}>
        <div className={classes.content}>
          <ProfileCoin />
          <div className={classes.info}>
            <Typography variant="caption">
              {album ? albumCode : <Skeleton width={200} />}
            </Typography>
            <Typography variant="h1">
              {album ? album.title : <Skeleton width={400} />}
            </Typography>
            <Typography variant="h5">
              {album ? formatDate(album.date) : <Skeleton width={500} />}
            </Typography>
            {creator ? (
              <React.Fragment>
                {album.createdBy === user?._id ? (
                  <Typography variant="body1">
                    You created this album on {formatDate(album.createdAt)}
                  </Typography>
                ) : (
                  <Typography variant="body1">
                    {"Created by " +
                      creator?.firstName +
                      " " +
                      creator?.lastName +
                      " on " +
                      formatDate(album.createdAt)}
                  </Typography>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={openShareModal}
                >
                  Share
                </Button>
                {album.createdBy === user?._id && (
                  <Button
                    onClick={deleteAlbum}
                    variant="contained"
                    color="secondary"
                    isLoading={isDeleting}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </Button>
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
