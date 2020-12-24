import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import Button from "./Button";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    backgroundColor: "white",
    boxShadow: theme.shadows[10],
    outline: "none",
    border: "none",
    borderRadius: "5px",
    padding: "20px",
  },
  btn: {
    margin: "5px",
  },
}));

export default function DoesNotExistModal({ open }) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Modal open={open}>
      <div className={classes.root}>
        <Typography variant="h3">
          The album you are looking for does not exist.
        </Typography>
        <div style={{ textAlign: "right" }}>
          <Button
            onClick={() => history.push("/")}
            className={classes.btn}
            variant="outlined"
            color="primary"
          >
            Go Home
          </Button>
        </div>
      </div>
    </Modal>
  );
}
