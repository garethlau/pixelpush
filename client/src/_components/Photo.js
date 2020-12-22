import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  img: {
    width: "100%",
  },
  dimensions: {
    position: "absolute",
    top: 0,
    left: 0,
    // backgroundColor: theme.palette.grey[100],
    backdropFilter: "blur(10px) brightness(0.9)",
    padding: "5px",
  },
}));

export default function Photo({ photo }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <img className={classes.img} src={photo.url} alt="" />
      <span className={classes.dimensions}>
        <Typography variant="caption">
          {photo.width}x{photo.height}
        </Typography>
      </span>
    </div>
  );
}
