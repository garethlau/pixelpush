import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextInput from "../_components/TextInput";
import Button from "../_components/Button";
import { useHistory } from "react-router-dom";
import useTextInput from "../_hooks/useTextInput";

import createAlbum from "../_utils/createAlbum";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
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
    width: "640px",
    padding: "20px",
    borderRadius: "10px",
  },
}));

export default function Home() {
  const classes = useStyles();
  const history = useHistory();

  const title = useTextInput("");

  async function submit() {
    try {
      const data = {
        title: title.value,
      };
      const album = await createAlbum(data);
      if (album) {
        history.push(`/albums/${album.code}`);
      }
    } catch (error) {}
  }

  return (
    <div className={classes.root}>
      <div className={classes.parent}>
        <div className={classes.form}>
          <Typography variant="h1">Create Album</Typography>
          <div>
            <Typography variant="body1">I'm creating an album for</Typography>
            <TextInput value={title.value} onChange={title.onChange} />
            <Typography variant="body1">which took place on</Typography>
            <TextInput />
            <Typography variant="body1">at</Typography>
            <TextInput />
          </div>
          <div>
            <Button variant="contained" color="primary" onClick={submit}>
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
