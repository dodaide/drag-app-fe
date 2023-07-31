import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  useTheme,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { axios } from '../utils/httpHelper'
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "../utils/constants";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const {
    handleSubmit: handleSubmitLogin,
    register: registerLogin,
    formState: { errors: errorsLogin },
  } = useForm();
  const theme = useTheme();
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorMessage2, setErrorMessage2] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get(ACCESS_TOKEN);
    if(accessToken){
      navigate("/");
    }
  }, [])

  const handleClickOpen = () => {
    setOpen(true);  
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const onSubmitLogin = (data) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, data)
      .then((response) => {
        setErrorMessage();
        Cookies.set(ACCESS_TOKEN, response.data, {
          expires: 2 / 24,
          path: "/",
        });
        navigate("/");
      })
      .catch((err) => {
        setErrorMessage(err.response.data);
      });
  };

  const {
    handleSubmit: handleSubmitSignUp,
    register: registerSignUp,
    formState: { errors: errorsSignUp },
  } = useForm();

  const onSubmitSignUp = (data) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/register`, data)
      .then((response) => {
        setErrorMessage();
        handleClose();
        Cookies.set(ACCESS_TOKEN, response.data, {
          expires: 2 / 24,
          path: "/",
        });
        navigate("/");
      })
      .catch((err) => {
        setErrorMessage2(err.response.data);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={20} textAlign="center">
        <Typography variant="h4" component="h1">
          Login
        </Typography>
      </Box>
      <Box>
        <form onSubmit={handleSubmitLogin(onSubmitLogin)}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            {...registerLogin("username", {
              required: "Please enter your username",
            })}
            error={!!errorsLogin.userName}
            helperText={errorsLogin.userName?.message}
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            type="password"
            {...registerLogin("password", {
              required: "Please enter a password",
            })}
            error={!!errorsLogin.password}
            helperText={errorsLogin.password?.message}
          />
          {errorMessage && (
            <Typography variant="subtitle1" align="left" color="red">
              {errorMessage}
            </Typography>
          )}
          <Typography
            variant="subtitle1"
            align="right"
            color={theme.palette.primary.main}
            gutterBottom
          >
            Forgot Password?
          </Typography>
          <Button variant="contained" type="submit" fullWidth>
            Login
          </Button>
          <Typography
            variant="subtitle1"
            color={theme.palette.primary.main}
            onClick={handleClickOpen}
            marginTop={20}
          >
            Sign up here
          </Typography>
        </form>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmitSignUp(onSubmitSignUp)}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Username"
              fullWidth
              variant="standard"
              {...registerSignUp("su_username", {
                required: "Please enter your username",
              })}
              error={!!errorsSignUp.su_userName}
              helperText={errorsSignUp.su_userName?.message}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              {...registerSignUp("su_password", {
                required: "Please enter a password",
              })}
              error={!!errorsSignUp.su_password}
              helperText={errorsSignUp.su_password?.message}
            />
            {errorMessage2 && (
              <Typography variant="subtitle1" align="left" color="red">
                {errorMessage2}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Ok</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
