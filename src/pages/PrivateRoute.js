import { useLayoutEffect, useState } from "react";
import { axios } from "../utils/httpHelper";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../redux/action/userActions";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "../utils/constants";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const [isLogin, setIslogin] = useState(!!Cookies.get(ACCESS_TOKEN));

  useLayoutEffect(() => {
    if (isLogin) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/user/getUser`)
        .then((response) => {
          dispatch(getCurrentUser(response.data.username));
        })
        .catch(() => {
          Cookies.remove(ACCESS_TOKEN, { path: '/' });
          setIslogin(false);
        });
    }
  }, []);

  return isLogin ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
