import { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Skeleton from "@material-ui/lab/Skeleton";
import { PhotoDetailsContext } from "../_contexts/photoDetails";
import useUser from "../_queries/useUser";
import { formatFileSize } from "../_utils/formatter";

const useStyles = makeStyles((theme) => ({
  root: {
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
}));

export default function PhotoDetails() {
  const classes = useStyles();
  const { close, photo, isOpen } = useContext(PhotoDetailsContext);
  const { data: user } = useUser(photo?.uploadedBy);

  return (
    <Modal open={isOpen} onClose={close}>
      <div className={classes.root}>
        <TableContainer>
          <Table className={classes.table}>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">
                  {photo ? photo.name : <Skeleton />}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Uploaded By</TableCell>
                <TableCell align="right">
                  {user ? user?.firstName + " " + user?.lastName : <Skeleton />}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell align="right">
                  {photo ? photo.type : <Skeleton />}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Size</TableCell>
                <TableCell align="right">
                  {photo ? formatFileSize(photo.size) : <Skeleton />}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Height</TableCell>
                <TableCell align="right">
                  {photo ? photo.height + "px" : <Skeleton />}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Width</TableCell>
                <TableCell align="right">
                  {photo ? photo.width + "px" : <Skeleton />}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Modal>
  );
}
