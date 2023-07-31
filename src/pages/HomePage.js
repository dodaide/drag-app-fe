import Header from "../components/Header";
import AppCard from "../components/AppCard";
import {
  Grid,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { axios } from "../utils/httpHelper";
import { Add } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { MENU_ID } from "../utils/constants";
import MultipleSelectChip from "../components/MultipleSelectChip";

export default function HomePage() {
  const [windowList, setWindowList] = useState([]);
  const [windowGroupList, setWindowGroupList] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const { handleSubmit, register, reset } = useForm();
  const { show } = useContextMenu({ id: MENU_ID });
  const [clickedId, setClickedId] = useState();

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  function handleContextMenu(event, id) {
    setClickedId(id);
    show({
      event,
      props: {
        key: "value",
      },
    });
  }

  const handleDeleteWindow = () => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/window/deleteWindow/${clickedId}`
      )
      .then(() => {
        setWindowList((prevList) =>
          prevList.filter((window) => window._id !== clickedId)
        );
        setOpen2(false);
      })
      .catch(() => {
        alert("Lỗi khi xóa dữ liệu");
      });
  };

  const submitWindow = (data) => {
    const apiUrl = clickedId
      ? `${process.env.REACT_APP_API_URL}/window/renameWindow/${clickedId}`
      : `${process.env.REACT_APP_API_URL}/window/createWindow`;

    if (clickedId) {
      axios
        .patch(apiUrl, data)
        .then(() => {
          setWindowList((prevList) =>
            prevList.map((window) =>
              window._id === clickedId ? { ...window, name: data.name } : window
            )
          );
        })
        .catch(() => {
          alert("Lỗi khi sửa dữ liệu");
        });
    } else {
      axios
        .post(apiUrl, data)
        .then((response) => {
          setWindowList((prevList) => [...prevList, response.data]);
        })
        .catch(() => {
          alert("Lỗi khi thêm dữ liệu");
        });
    }
    handleClose();
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/window/getAllWindows`)
      .then((response) => {
        setWindowList(response.data);
      })
      .catch(() => {});

    axios
      .get(`${process.env.REACT_APP_API_URL}/userwindow/getAllWindows`)
      .then((response) => {
        setWindowGroupList(response.data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <Container sx={{ marginY: "16px" }} maxWidth="xl">
        <Typography variant="h6" marginY={2}>
          Your Apps
        </Typography>
        <Divider />
        <Grid container marginY={3} spacing={2}>
          {windowList.map((app) => (
            <Grid
              onContextMenu={(e) => handleContextMenu(e, app._id)}
              key={app._id}
              item
              xs={2}
            >
              <AppCard title={app.name} id={app._id} />
            </Grid>
          ))}
          <Grid item xs={2}>
            <Button
              variant="contained"
              onClick={() => {
                setClickedId();
                setOpen(true);
              }}
              sx={{height: '100%', width: '100%'}}
            >
              <Add fontSize="large"/>
            </Button>
          </Grid>
        </Grid>
        <Divider />
        <Typography variant="h6" marginY={2}>
          Your Group Apps 
        </Typography>
        <Divider />
        <Grid container marginY={3} spacing={2}>
          {windowGroupList.map((app) => (
            <Grid
              key={app._id}
              item
              xs={2}
            >
              <AppCard title={app.name} id={app._id} />
            </Grid>
          ))}
        </Grid>
      </Container>
      <Menu id={MENU_ID}>
        <Item onClick={() => setOpen3(true)}>Share</Item>
        <Item onClick={() => setOpen2(true)}>Delete</Item>
        <Item onClick={() => setOpen(true)}>Rename</Item>
      </Menu>

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(submitWindow)}>
          <DialogTitle>Enter App Name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              fullWidth
              variant="standard"
              {...register("name")}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={open2} onClose={() => setOpen2(false)}>
        <DialogTitle>Are you sure you want to delete?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpen2(false)}>Disagree</Button>
          <Button onClick={handleDeleteWindow}>Agree</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open3} onClose={() => setOpen3(false)}>
        <DialogTitle>Add people to your App</DialogTitle>
        <MultipleSelectChip windowId={clickedId} />
      </Dialog>
    </>
  );
}
