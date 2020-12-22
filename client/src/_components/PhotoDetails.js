import { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { PhotoDetailsContext } from "../_contexts/photoDetails";
import Modal from "@material-ui/core/Modal";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    height: "300px",
    backgroundColor: "grey",
  },
}));

export default function PhotoDetails() {
  const classes = useStyles();
  const { close, photo, isOpen } = useContext(PhotoDetailsContext);

  return (
    <Modal open={isOpen} onClose={close}>
      <div className={classes.root}>
        <div>{photo && photo.name}</div>
      </div>
    </Modal>
  );
}
