import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Typography from "@material-ui/core/Typography";
// Mutations
import useCreateAlbum from "../_mutations/useCreateAlbum";
// Components
import Button from "../_components/Button";
import ProfileCoin from "../_components/ProfileCoin";
// Hooks
import useTextInput from "../_hooks/useTextInput";
// Assets
import backgroundImg from "../_assets/images/home-background.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    position: "relative",
  },
  parent: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  form: {
    boxShadow: theme.shadows[7],
    width: "300px",
    padding: "20px",
    borderRadius: "10px",
    zIndex: 1,
    backgroundColor: "white",
  },
  input: {
    width: "200px",
    margin: "20px auto",
  },
  backgroundImg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  profileCoin: {
    position: "absolute",
    top: "30px",
    right: "30px",
    zIndex: 1,
  },
}));

export default function Home() {
  const classes = useStyles();
  const history = useHistory();

  const title = useTextInput("");
  const {
    mutateAsync: createAlbum,
    isLoading: creatingAlbum,
  } = useCreateAlbum();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    console.log(date);
    setSelectedDate(date);
  };

  async function submit() {
    if (title.value === "") {
      enqueueSnackbar("Please enter an event name.", { variant: "error" });
      return;
    }
    try {
      const data = {
        title: title.value,
        date: selectedDate,
      };
      const album = await createAlbum(data);
      if (album) {
        history.push(`/albums/${album.code}`);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          enqueueSnackbar("Please log in to create an album.", {
            variant: "default",
            action: (key) => (
              <Button
                onClick={() => {
                  closeSnackbar(key);
                  history.push("/login");
                }}
                variant="contained"
                color="primary"
              >
                Log in
              </Button>
            ),
          });
        }
      }
    }
  }

  return (
    <React.Fragment>
      <div className={classes.root}>
        <div className={classes.profileCoin}>
          <ProfileCoin />
        </div>
        <img src={backgroundImg} className={classes.backgroundImg} />
        <div className={classes.parent}>
          <div className={classes.form}>
            <Typography variant="h2">Pixel Push</Typography>
            <Typography variant="body1">Share the moments</Typography>
            <div>
              <div className={classes.input}>
                <TextField
                  label="Event Name"
                  fullWidth
                  value={title.value}
                  onChange={title.onChange}
                />
              </div>
              <div className={classes.input}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    disableFuture
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
            <div className={classes.input}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={submit}
                isLoading={creatingAlbum}
              >
                Create Album
              </Button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
