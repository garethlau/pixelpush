import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import useAuthedUser from "../_queries/useAuthedUser";
import Avatar from "@material-ui/core/Avatar";
import Button from "./Button";
import { useLocation } from "react-router-dom";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import useLogout from "../_mutations/useLogout";
import { useSnackbar } from "notistack";
import { AnimatePresence, motion } from "framer-motion";
import FaceIcon from "@material-ui/icons/Face";
import red from "@material-ui/core/colors/red";

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    backgroundColor: red.A200,
    boxShadow: theme.shadows[3],
    float: "left",
    "&:hover": {
      cursor: "pointer",
    },
  },
  modal: {
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
  },
  action: {
    marginTop: "10px",
  },
}));

export default function ProfileCoin() {
  const classes = useStyles();
  const { data: user, isLoading } = useAuthedUser();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { mutateAsync: _logout } = useLogout();
  const { enqueueSnackbar } = useSnackbar();

  async function logout() {
    try {
      await _logout();
      window.location.reload();
    } catch (error) {
      enqueueSnackbar("There was an error logging out. Please try again.", {
        variant: "error",
      });
    }
  }

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={classes.modal}>
          {user ? (
            <React.Fragment>
              <Typography variant="body1">
                Display Name: {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body1">Email: {user?.email}</Typography>
              <Button
                color="secondary"
                variant="contained"
                onClick={logout}
                className={classes.action}
              >
                Log out
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography variant="body1">You are not logged in.</Typography>
              <Typography variant="body2">
                You'll need to log in to create albums and/or upload photos.
              </Typography>
              <Button
                href={`/login?redirect=${location.pathname}`}
                variant="contained"
                color="primary"
                className={classes.action}
              >
                Log in
              </Button>
            </React.Fragment>
          )}
        </div>
      </Modal>
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            className={classes.root}
          >
            {!user ? (
              <Avatar className={classes.avatar} onClick={() => setOpen(true)}>
                <FaceIcon />
              </Avatar>
            ) : (
              <Avatar className={classes.avatar} onClick={() => setOpen(true)}>
                {user.firstName.charAt(0)}
              </Avatar>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}
