import { useState, useContext } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import useUser from "../_queries/useUser";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import IconButton from "@material-ui/core/IconButton";
import GetAppIcon from "@material-ui/icons/GetApp";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import animPhoto from "../_animations/photo";
import { PhotoDetailsContext } from "../_contexts/photoDetails";
import useRemovePhoto from "../_mutations/useRemovePhoto";
import { useParams } from "react-router-dom";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  img: {
    width: "100%",
  },
  actions: {
    position: "absolute",
    right: "10px",
    top: "50%",
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[10],
    borderRadius: "5px",
  },
}));

function getMobileOperatingSystem() {
  let userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/windows phone/i.test(userAgent)) return "Windows Phone";
  if (/android/i.test(userAgent)) return "Android";
  if (/ipad|iPhone|iPod/.test(userAgent) && !window.MSStream) return "iOS";
  return "Unknown";
}

export default function Photo({ photo }) {
  const classes = useStyles();
  const { data: user, isLoading } = useUser();
  const [showActions, setShowActions] = useState(false);
  const { open } = useContext(PhotoDetailsContext);
  const { albumCode } = useParams();

  const { mutateAsync: removePhoto } = useRemovePhoto(albumCode);

  const { ref, inView } = useInView({
    triggerOnce: true,
  });

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
        try {
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
        } catch (err) {}
      }
    } catch (error) {
      console.log(error);
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
      ref={ref}
      {...animPhoto}
      animate={inView ? "enter" : "initial"}
      className={classes.root}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <img className={classes.img} src={photo.url} alt="" />
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: "-50%" }}
            animate={{ opacity: 1, x: 0, y: "-50%" }}
            exit={{ opacity: 0, x: 10, y: "-50%" }}
            className={classes.actions}
          >
            <div>
              <IconButton color="primary" onClick={openDetails}>
                <InfoOutlinedIcon />
              </IconButton>
            </div>
            <div>
              <IconButton color="primary" onClick={download}>
                <GetAppIcon />
              </IconButton>
            </div>
            {!isLoading && photo.uploadedBy === user?._id && (
              <div>
                <IconButton color="primary" onClick={remove}>
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
