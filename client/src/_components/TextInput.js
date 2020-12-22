import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    border: "none",
    borderBottom: "1px solid black",
    padding: "10px",
    backgroundColor: theme.palette.grey[300],
    outline: "none",
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
  },
}));

export default function TextInput(props) {
  const classes = useStyles();
  return <input className={classes.root} />;
}
