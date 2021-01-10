import { useState, useContext, useMemo, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import IconButton from "@material-ui/core/IconButton";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import Skeleton from "@material-ui/lab/Skeleton";
import Tooltip from "@material-ui/core/Tooltip";
// Contexts
import { PhotoDetailsContext } from "../../_contexts/photoDetails";
// Components
import Button from "../Button";
// Queries
import useAuthedUser from "../../_queries/useAuthedUser";
// Mutations
import useRemovePhoto from "../../_mutations/useRemovePhoto";

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
    left: "50%",
    bottom: "40px",
    width: "250px",
    textAlign: "center",
  },
  skeletonContainer: {
    paddingTop: "56.25%",
    position: "relative",
    height: 0,
    overflow: "hidden",
    boxShadow: theme.shadows[5],
    borderRadius: "3px",
    margin: "20px 0",
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
  status: {
    position: "absolute",
    top: "30px",
    left: "10px",
    padding: "5px",
    backdropFilter: "blur(10px)",
    textAlign: "center",
    "& p": {
      color: "white",
      margin: 0,
    },
  },
}));

export default function Photo({ photo, isCreator }) {
  const classes = useStyles();
  const { data: user, isLoading } = useAuthedUser();
  const [showActions, setShowActions] = useState(false);
  const { open } = useContext(PhotoDetailsContext);
  const { albumCode } = useParams();
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [srcLoaded, setSrcLoaded] = useState(false);
  const [useSrc, setUseSrc] = useState(false);

  const { mutateAsync: removePhoto } = useRemovePhoto(albumCode);

  const canDelete = useMemo(() => {
    if (isCreator) return true;
    if (photo?.uploadedBy === user?._id) return true;
    return false;
  }, [photo, isCreator, user]);

  function openDetails() {
    open(photo);
  }

  async function remove() {
    try {
      await removePhoto(photo.key);
    } catch (error) {
      console.log(error);
    }
  }
  const status = useMemo(() => {
    if (!previewLoaded) return null;
    if (!useSrc) {
      return (
        <Tooltip
          arrow
          title="Click the image to load the full resolution version."
          placement="right"
        >
          <p>preview</p>
        </Tooltip>
      );
    } else if (useSrc && !srcLoaded) {
      return (
        <Tooltip
          arrow
          title="The full resolution image is loading."
          placement="right"
        >
          <p>loading</p>
        </Tooltip>
      );
    } else {
      return null;
    }
  }, [useSrc, srcLoaded, previewLoaded]);

  const previewImg = useMemo(
    () => (
      <img
        className={previewLoaded ? classes.img : classes.imgLoading}
        src={photo.previewUrl}
        alt=""
        onLoad={() => setPreviewLoaded(true)}
      />
    ),
    [previewLoaded]
  );

  const fullImg = useMemo(
    () => (
      <img
        className={srcLoaded ? classes.img : classes.imgLoading}
        src={photo.url}
        alt=""
        onLoad={() => setSrcLoaded(true)}
      />
    ),
    [srcLoaded]
  );

  useEffect(() => {
    if (!!photo.noPreview) {
      setUseSrc(true);
      setPreviewLoaded(true);
    }
  }, [photo]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 0.7 }}
      className={classes.root}
      onClick={() => setShowActions(!showActions)}
      onMouseLeave={() => setShowActions(false)}
    >
      <AnimatePresence>
        {!previewLoaded && (
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
      </AnimatePresence>
      {!srcLoaded && previewImg}
      {useSrc && fullImg}

      <AnimatePresence>
        <div className={classes.status}>{status}</div>
        {previewLoaded && showActions && (
          <motion.div
            initial={{ opacity: 0, x: "-50%", y: 10 }}
            animate={{ opacity: 1, x: "-50%", y: 0 }}
            exit={{ opacity: 0, x: "-50%", y: 10 }}
            className={classes.actions}
          >
            {!useSrc && (
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={() => !useSrc && setUseSrc(true)}
                className={classes.btn}
              >
                Load Full
              </Button>
            )}
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={openDetails}
              className={classes.btn}
            >
              Info
            </Button>
            {canDelete && (
              <Button
                className={classes.btn}
                size="small"
                color="secondary"
                variant="contained"
                onClick={remove}
              >
                Remove
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
