import { useState, useContext, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import IconButton from "@material-ui/core/IconButton";
import GetAppIcon from "@material-ui/icons/GetApp";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
import Skeleton from "@material-ui/lab/Skeleton";
import { useSnackbar } from "notistack";
// Contexts
import { PhotoDetailsContext } from "../_contexts/photoDetails";
// Queries
import useAuthedUser from "../_queries/useAuthedUser";
// Mutations
import useRemovePhoto from "../_mutations/useRemovePhoto";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  img: {
    width: "100%",
    boxShadow: theme.shadows[5],
    margin: "20px 0",
    borderRadius: "3px",
  },
  imgLoading: {
    height: 0,
  },
  actions: {
    position: "absolute",
    right: "10px",
    top: "50%",
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[10],
    borderRadius: "5px",
  },
  skeletonContainer: {
    paddingTop: "56.25%",
    position: "relative",
    height: 0,
    overflow: "hidden",
    boxShadow: theme.shadows[5],
    borderRadius: "3px",
  },
  skeleton: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  btn: {
    margin: "2.5px",
  },
}));

function getMobileOperatingSystem() {
  let userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/windows phone/i.test(userAgent)) return "Windows Phone";
  if (/android/i.test(userAgent)) return "Android";
  if (/ipad|iPhone|iPod/.test(userAgent) && !window.MSStream) return "iOS";
  return "Unknown";
}

export default function Photo({ photo, isCreator }) {
  const classes = useStyles();
  const { data: user, isLoading } = useAuthedUser();
  const [showActions, setShowActions] = useState(false);
  const { open } = useContext(PhotoDetailsContext);
  const { albumCode } = useParams();
  const [loaded, setLoaded] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: removePhoto } = useRemovePhoto(albumCode);

  const canDelete = useMemo(() => {
    if (isCreator) return true;
    if (photo?.uploadedBy === user?._id) return true;
    return false;
  }, [photo, isCreator, user]);

  function openDetails() {
    open(photo);
  }

  async function download() {
    try {
      const response = await axios.get(photo.url, { responseType: "blob" });
      const { data } = response;
      let blobData = [data];
      let blob = new Blob(blobData, { type: data.type });
      let os = getMobileOperatingSystem();
      if (os === "iOS") {
        let reader = new FileReader();
        reader.onload = (e) => {
          window.location.href = reader.result;
        };

        reader.addEventListener("loadend", () => {});
        reader.addEventListener("error", () => {});
        reader.readAsDataURL(blob);
      } else {
        let blobURL = window.URL.createObjectURL(blob);
        let tempLink = document.createElement("a");
        tempLink.style.display = "none";
        tempLink.href = blobURL;
        tempLink.setAttribute("download", photo.name);
        if (typeof tempLink.download === "undefined") {
          tempLink.setAttribute("target", "_blank");
        }

        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("There was an error downloading the file.", {
        variant: "error",
      });
    }
  }

  async function remove() {
    try {
      await removePhoto(photo.key);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <motion.div
      exit={{ opacity: 0, scale: 0.7 }}
      className={classes.root}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <AnimatePresence>
        {!loaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={classes.skeletonContainer}
            key={"loader"}
          >
            <Skeleton
              variant="rect"
              animation="wave"
              className={classes.skeleton}
            />
          </motion.div>
        )}

        <motion.img
          key={"image"}
          className={loaded ? classes.img : classes.imgLoading}
          src={photo.url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          alt=""
          onLoad={() => setLoaded(true)}
        />
      </AnimatePresence>
      <AnimatePresence>
        {loaded && showActions && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: "-50%" }}
            animate={{ opacity: 1, x: 0, y: "-50%" }}
            exit={{ opacity: 0, x: 10, y: "-50%" }}
            className={classes.actions}
          >
            <div>
              <IconButton
                className={classes.btn}
                size="small"
                color="primary"
                onClick={openDetails}
              >
                <InfoOutlinedIcon />
              </IconButton>
            </div>
            <div>
              <IconButton
                className={classes.btn}
                size="small"
                color="primary"
                onClick={download}
              >
                <GetAppIcon />
              </IconButton>
            </div>
            {canDelete && (
              <div>
                <IconButton
                  className={classes.btn}
                  size="small"
                  color="primary"
                  onClick={remove}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
