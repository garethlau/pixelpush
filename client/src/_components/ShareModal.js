import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSnackbar } from "notistack";
import QRCode from "./QRCode";
import Seperator from "./Seperator";

const ORIGIN = process.env.REACT_APP_ORIGIN || "localhost:3000";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "350px",
    backgroundColor: "white",
    boxShadow: theme.shadows[10],
    outline: "none",
    border: "none",
    borderRadius: "5px",
    padding: "20px",
    textAlign: "center",
  },
  code: {
    fontWeight: 600,
    fontSize: "2rem",
    transition: "ease 0.3s",
    margin: "10px",
    "&:hover": {
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
  },
  helper: {
    opacity: 0.7,
    fontSize: "12px",
  },
}));

export default function ShareModal({ isOpen, close }) {
  const classes = useStyles();
  const { albumCode } = useParams();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return (
    <Modal open={isOpen} onClose={close}>
      <div className={classes.root}>
        <p>Use the magic code</p>
        <CopyToClipboard
          text={`${ORIGIN}/albums/${albumCode}`}
          onCopy={() => {
            enqueueSnackbar(`URL copied to clipboard.`, {
              variant: "success",
            });
            setTimeout(closeSnackbar, 5000);
          }}
        >
          <p className={classes.code}>{albumCode}</p>
        </CopyToClipboard>
        <p className={classes.helper}>Click the code to copy the URL</p>
        <Seperator>OR</Seperator>
        <p>Scan the QR Code</p>
        <QRCode />
        <p>
          Please note that anyone with the link can download any photos in the
          album and can upload any photos to the album.
        </p>
      </div>
    </Modal>
  );
}
