import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import useUser from "../_queries/useUser";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import IconButton from "@material-ui/core/IconButton";
import { useState } from "react";
import GetAppIcon from "@material-ui/icons/GetApp";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  img: {
    width: "100%",
  },
  actions: {
    position: "absolute",
    right: "10px",
    top: "50%",
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[10],
    borderRadius: "5px",
    transform: "translateY(-50%)",
  },
}));

export default function Photo({ photo }) {
  const classes = useStyles();
  const { data: user, isLoading } = useUser();
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={classes.root}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <img className={classes.img} src={photo.url} alt="" />
      {showActions && (
        <div className={classes.actions}>
          <div>
            <IconButton color="primary" size="large">
              <InfoOutlinedIcon />
            </IconButton>
          </div>
          <div>
            <IconButton color="primary" size="large">
              <GetAppIcon />
            </IconButton>
          </div>
          {!isLoading && photo.userId === user?._id && (
            <div>
              <IconButton color="primary" size="large">
                <RemoveCircleOutlineIcon />
              </IconButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
