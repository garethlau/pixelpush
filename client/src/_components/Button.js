import Button from "@material-ui/core/Button";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const StyledCircularProgress = withStyles((theme) => ({
  root: {
    color: "white",
  },
}))(CircularProgress);

const useStyles = makeStyles((theme) => ({
  disabled: {
    color: "white",
    opacity: 0.7,
  },
  label: {
    textTransform: "none",
    fontWeight: 500,
    fontSize: "16px",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "24px",
  },
  contained: {
    color: "white",
  },
  outlinedPrimary: {
    color: theme.palette.primary.main,
  },
}));

export default function _Button({ children, isLoading, ...others }) {
  const classes = useStyles();
  return (
    <Button
      classes={{
        label: classes.label,
        disabled: classes.disabled,
        outlinedPrimary: classes.outlinedPrimary,
        contained: classes.contained,
      }}
      {...others}
    >
      <span style={{ opacity: isLoading ? 0 : 1 }}>{children}</span>
      <span className={classes.loader}>
        {isLoading && <StyledCircularProgress size={24} />}
      </span>
    </Button>
  );
}
