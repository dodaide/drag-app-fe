import {
  Typography,
  Box,
  Stack,
  Avatar,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogActions,
  Tabs,
  Tab,
} from "@mui/material";
import { useState, forwardRef, useContext, useEffect } from "react";
import MuiAlert from "@mui/material/Alert";
import { dataContext } from "../pages/SettingPage";
import { APP_FUNCTIONS, ADMIN } from "../utils/constants";
import { useParams } from "react-router-dom";
import { axios } from "../utils/httpHelper";
import ResponsiveDrawer from "./ResponsiveDrawer";
import TableRecorder from "./TableRecorder";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TabPanel(props) {
  const { value } = props;

  switch (value) {
    case 0:
      return <ResponsiveDrawer />;
    case 1:
      return <TableRecorder />;
    default:
      return <Typography variant="h4">Comming soon</Typography>
  }
}

export default function ToolBar() {
  const [open, setOpen] = useState(false);
  const {
    windows,
    setWindows,
    firstWindows,
    setFirstWindows,
    initWindows,
    windowName,
    role,
  } = useContext(dataContext);
  const [alertContent, setAlertContent] = useState("");
  const [open2, setOpen2] = useState(false);
  const { id } = useParams();
  const [value, setValue] = useState(role === ADMIN ? 0 : 1);
  const [wantToView, setWantToView] = useState(false);

  // For LocalStorage

  // const clearAllData = () => {
  //   setWindows([]);
  //   setAlertContent("Clear All Successfully!");
  //   setOpen(true);
  //   setOpen2(false);
  //   localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify([]));
  // };

  // const handleSave = () => {
  //   setOpen(true);
  //   const serializedData = windows.map((item) => {
  //     const componentIndex = APP_FUNCTIONS.findIndex(
  //       (appFunc) => appFunc.id === item.idComponent
  //     );
  //     return {
  //       idComponent: item.idComponent,
  //       component: componentIndex,
  //       data: item.data,
  //     };
  //   });

  //   localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(serializedData));
  // };

  const handleSave = (myArr, isDiscardChange = false) => {
    const serializedData = myArr.map((item) => {
      const componentIndex = APP_FUNCTIONS.findIndex(
        (appFunc) => appFunc.id === item.idComponent
      );
      return {
        id: item.id,
        idComponent: item.idComponent,
        component: componentIndex,
        data: item.data,
      };
    });

    axios
      .patch(`${process.env.REACT_APP_API_URL}/window/editWindow/${id}`, {
        windows: serializedData,
      })
      .then(() => {
        if (isDiscardChange) {
          setWindows([...initWindows]);
          setAlertContent("Discard Change Successfully!");
        } else {
          setAlertContent("Save Successfully!");
        }
        setOpen(true);
        setFirstWindows(JSON.stringify(myArr));
      })
      .catch(() => {
        alert("Lỗi khi sửa dữ liệu");
      })
      .finally(() => {
        setOpen2(false);
      });
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (JSON.stringify(windows) !== firstWindows) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [windows, firstWindows]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleChange = (event, newValue) => {
    if (newValue === 1 && JSON.stringify(windows) !== firstWindows) {
      setWantToView(true);
      setOpen2(true);
    } else {
      setValue(newValue);
    }
  };

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Avatar variant="rounded" sx={{ width: 80, height: 80 }}>
          App
        </Avatar>
        <Stack>
          <Typography variant="h5" component="h3" align="left">
            {windowName}
          </Typography>
          <Typography variant="caption" gutterBottom>
            Note for app adminstrators does not exits
          </Typography>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Stack alignItems="end">
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={() => {
                setWantToView(false);
                setOpen2(true);
              }}
            >
              Discard Change
            </Button>
            <Button variant="contained" onClick={() => handleSave(windows)}>
              Update App
            </Button>
          </Stack>
          <Typography variant="caption" gutterBottom>
            Last Updated: trandoando02@gmail.com 2:47 PM
          </Typography>
        </Stack>
      </Stack>
      <Box sx={{ width: "100%", marginY: "16px" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
        >
          {role === ADMIN && <Tab value={0} label="Form" />}
          <Tab value={1} label="View" />
          <Tab value={2} label="Graph" />
          <Tab value={3} label="App Setting" />
        </Tabs>
      </Box>
      <TabPanel value={value} />
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {alertContent}
        </Alert>
      </Snackbar>
      <Dialog open={open2} onClose={handleClose2}>
        {wantToView ? (
          <>
            <DialogTitle>Are you sure you want to save?</DialogTitle>
            <DialogActions>
              <Button onClick={handleClose2}>Disagree</Button>
              <Button
                onClick={() => {
                  setValue(1);
                  handleSave(windows);
                }}
              >
                Agree
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Are you sure you want to discard change?</DialogTitle>
            <DialogActions>
              <Button onClick={handleClose2}>Disagree</Button>
              <Button onClick={() => handleSave(initWindows, true)}>
                Agree
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
