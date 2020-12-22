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

export default function Photo({ photo }) {
  const classes = useStyles();
  const { data: user, isLoading } = useUser();
  const [showActions, setShowActions] = useState(false);
  const { open } = useContext(PhotoDetailsContext);
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  function openDetails() {
    open(photo);
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
              <IconButton color="primary">
                <GetAppIcon />
              </IconButton>
            </div>
            {!isLoading && photo.userId === user?._id && (
              <div>
                <IconButton color="primary">
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
