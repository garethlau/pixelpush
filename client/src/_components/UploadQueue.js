import { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { UploadQueueContext } from "../_contexts/uploadQueue";
import { UploadProgressContext } from "../_contexts/uploadProgress";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "./LinearProgress";
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
    margin: 10,
  },
}));

export default function UploadQueue() {
  const classes = useStyles();
  const { uploadQueue } = useContext(UploadQueueContext);
  const { progress } = useContext(UploadProgressContext);

  if (uploadQueue.size() > 0) {
    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <Typography variant="h3">
            Queued Uploads ({uploadQueue.size()})
          </Typography>
        </div>
        <div className={classes.cardContainer}>
          <LinearProgress
            className={classes.progress}
            variant="determinate"
            value={(progress * 100).toFixed(0)}
          />
          {uploadQueue.values.map((file, index) => (
            <div key={index} className={classes.fileCard}>
              <Typography noWrap variant="body1">
                {file.name}
              </Typography>
              <Typography noWrap variant="caption">
                {formatFileSize(file.size)}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    );
  } else return null;
}
