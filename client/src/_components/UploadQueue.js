import { useContext, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { AnimatePresence, motion } from "framer-motion";
// Contexts
import { UploadQueueContext } from "../_contexts/uploadQueue";
import { UploadProgressContext } from "../_contexts/uploadProgress";
// Components
import LinearProgress from "./LinearProgress";
// Utils
import { formatFileSize } from "../_utils/formatter";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: "0",
    right: "30px",
    width: "300px",
    height: "400px",
    backgroundColor: "#ffffff42",
    backdropFilter: "blur(10px) brightness(0.7)",
    boxShadow: theme.shadows[7],
    zIndex: 5,
  },
  header: {
    position: "relative",
    top: 0,
    backgroundColor: theme.palette.primary.main,
    padding: "10px",
    color: theme.palette.common.white,
    borderRadius: "5px 5px 0 0",
    height: "50px",
  },
  cardContainer: {
    height: "350px",
    overflowY: "auto",
  },
  fileCard: {
    backgroundColor: "white",
    borderRadius: "5px",
    padding: "5px",
    margin: "10px",
    boxShadow: theme.shadows[5],
  },
  progress: {
    margin: "5px 0",
  },
}));

export default function UploadQueue() {
  const classes = useStyles();
  const { uploadQueue } = useContext(UploadQueueContext);
  const { getProgress, isUploading, uploads } = useContext(
    UploadProgressContext
  );

  return (
    <AnimatePresence>
      {uploadQueue.size() > 0 && (
        <motion.div
          className={classes.root}
          initial={{ y: 300 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
        >
          <div className={classes.header}>
            <Typography variant="h3">
              Queued Uploads ({uploadQueue.size()})
            </Typography>
          </div>
          <div className={classes.cardContainer}>
            <AnimatePresence>
              {uploadQueue.values.map((file) => (
                <motion.div
                  key={file.key}
                  className={classes.fileCard}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0, scaleY: 0.5 }}
                >
                  <Typography noWrap variant="body1">
                    {file.name}
                  </Typography>
                  <Typography noWrap variant="caption">
                    {formatFileSize(file.size)}
                  </Typography>
                  {isUploading(file.key) && (
                    <LinearProgress
                      className={classes.progress}
                      variant="determinate"
                      value={(getProgress(file.key) * 100).toFixed(0)}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
