import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import useAuthedUser from "../_queries/useAuthedUser";
import Avatar from "@material-ui/core/Avatar";
import Button from "./Button";
import { useLocation } from "react-router-dom";
import blue from "@material-ui/core/colors/blue";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import useLogout from "../_mutations/useLogout";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "30px",
    right: "30px",
    zIndex: 1,
  },
  avatar: {
    backgroundColor: blue[300],
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
    width: "400px",
    backgroundColor: "white",
    boxShadow: theme.shadows[10],
    outline: "none",
    border: "none",
    borderRadius: "5px",
    padding: "20px",
  },
  logout: {
    marginLeft: "5px",
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

  if (isLoading) return null;
  return (
    <div className={classes.root}>
      {!user ? (
        <Button
          href={`/login?redirect=${location.pathname}`}
          variant="contained"
          color="primary"
        >
          Log in
        </Button>
      ) : (
        <React.Fragment>
          <Avatar className={classes.avatar} onClick={() => setOpen(true)}>
            {user.firstName.charAt(0)}
          </Avatar>
          <Button
            color="secondary"
            variant="contained"
            className={classes.logout}
            onClick={logout}
          >
            Log out
          </Button>
          <Modal open={open} onClose={() => setOpen(false)}>
            <div className={classes.modal}>
              <Typography variant="h1">Profile</Typography>
              <Typography variant="body1">
                You're visible to others as: {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body1">Email: {user.email}</Typography>
            </div>
          </Modal>
        </React.Fragment>
      )}
    </div>
  );
}
