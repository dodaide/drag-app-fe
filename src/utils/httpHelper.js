import axios from "axios";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "./constants";

axios.interceptors.request.use(config => {
    const accessToken = Cookies.get(ACCESS_TOKEN);
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  });

export { axios }