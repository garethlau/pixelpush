import { makeStyles, withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const StyledLinearProgress = withStyles((theme) => ({
  root: {
    height: 5,
    borderRadius: 2,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 2,
    backgroundColor: "#1a90ff",
  },
}))(LinearProgress);

export default function _LinearProgress(props) {
  return <StyledLinearProgress {...props} />;
}
