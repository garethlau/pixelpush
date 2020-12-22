import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import deepPurple from "@material-ui/core/colors/deepPurple";
import amber from "@material-ui/core/colors/amber";
import Button from "../_components/Button";
import useLogin from "../_mutations/useLogin";
import useSignup from "../_mutations/useSignup";
import useTextInput from "../_hooks/useTextInput";
import { useHistory } from "react-router-dom";
import qs from "query-string";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    overflowY: "hidden",
    display: "flex",
    flexDirection: "row",
  },
  sidebar: {
    width: 0,
    [theme.breakpoints.up("sm")]: {},
    [theme.breakpoints.up("md")]: {
      width: "450px",
    },
    [theme.breakpoints.up("lg")]: {
      width: "550px",
    },
  },
  content: {
    display: "flex",
    width: "100%",
    [theme.breakpoints.up("md")]: {
      flexDirection: "column",
    },
  },
  form: {
    width: "90%",
    height: "min-content",
    margin: "auto",
    [theme.breakpoints.up("md")]: {
      width: "500px",
    },
  },
  textField: {
    margin: "10px 0px",
  },
  alternativeDesktop: {
    [theme.breakpoints.up("md")]: {
      display: "flex",
      justifyContent: "flex-end",
      flexGrow: 0,
      padding: "30px 30px 0",
      alignItems: "center",
    },
    display: "none",
  },
  alternativeMobile: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
    textAlign: "center",
    marginTop: "20px",
  },
  link: {
    color: blue[500],
    textDecoration: "none",
    marginLeft: "5px",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

export default function Authenticate({ isLogin }) {
  const classes = useStyles();
  const email = useTextInput("");
  const password = useTextInput("");
  const firstName = useTextInput("");
  const lastName = useTextInput("");
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: signup, isLoading: signingUp } = useSignup();
  const { mutateAsync: login, isLoading: loggingIn } = useLogin();

  async function submit() {
    try {
      if (isLogin) {
        await login({ email: email.value, password: password.value });
      } else {
        await signup({
          email: email.value,
          password: password.value,
          firstName: firstName.value,
          lastName: lastName.value,
        });
      }

      email.reset();
      password.reset();
      firstName.reset();
      lastName.reset();

      // Redirect
      const { redirect } = qs.parse(history.location.search, {
        ignoreQueryPrefix: true,
      });
      if (redirect) history.push(redirect);
      else history.push("/");
    } catch (error) {
      // TODO
    }
  }

  const altAuth = isLogin ? (
    <Typography variant="body1">
      Don't have an account?{" "}
      <a href="/signup" className={classes.link}>
        Sign up
      </a>
    </Typography>
  ) : (
    <Typography>
      Already have an account?{" "}
      <a href="/login" className={classes.link}>
        Log in
      </a>
    </Typography>
  );

  return (
    <div className={classes.root}>
      <section
        className={classes.sidebar}
        style={{ backgroundColor: isLogin ? deepPurple[400] : amber[600] }}
      ></section>
      <section className={classes.content}>
        <div className={classes.alternativeDesktop}>{altAuth}</div>
        <div className={classes.form}>
          <Typography variant="h2">{isLogin ? "Log In" : "Sign Up"}</Typography>

          {!isLogin && (
            <React.Fragment>
              <TextField
                label="First name"
                fullWidth
                className={classes.textField}
                variant="outlined"
                value={firstName.value}
                onChange={firstName.onChange}
              />

              <TextField
                label="Last name"
                fullWidth
                className={classes.textField}
                variant="outlined"
                value={lastName.value}
                onChange={lastName.onChange}
              />
            </React.Fragment>
          )}

          <TextField
            label="Email"
            fullWidth
            className={classes.textField}
            variant="outlined"
            value={email.value}
            onChange={email.onChange}
          />

          <FormControl
            fullWidth
            className={classes.textField}
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adorment-password">
              Password
            </InputLabel>
            <OutlinedInput
              labelWidth={70}
              id="ouutlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={password.value}
              onChange={password.onChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    edge="end"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={submit}
            isLoading={signingUp || loggingIn}
          >
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
          <div className={classes.alternativeMobile}>{altAuth}</div>
        </div>
      </section>
    </div>
  );
}
