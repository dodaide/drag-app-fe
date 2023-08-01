import Header from "../components/Header";
import { Container, CircularProgress } from "@mui/material";
import IconBreadcrumbs from "../components/IconBreadcrumbs";
import ToolBar from "../components/ToolBar";
import { useState, createContext, useEffect } from "react";
import { APP_FUNCTIONS } from "../utils/constants";
import { useParams } from "react-router-dom";
import { axios } from "../utils/httpHelper";
import { useDispatch } from "react-redux";
import { getThisAdmin } from "../redux/action/userActions";

export const dataContext = createContext();

// const getWindowsFromLocalStorage = () => {
//   const rawData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME));
//   if(rawData){
//     const dataFromLocalStorage = rawData.map(item => ({
//       idComponent: item.idComponent,
//       component: APP_FUNCTIONS[item.component].component,
//       data: item.data,
//     }));
//     return dataFromLocalStorage
//   }
//   return [];
// };

export default function SettingPage() {
  // const [windows, setWindows] = useState(getWindowsFromLocalStorage());
  const [windows, setWindows] = useState([]);
  const [initWindows, setInitWindows] = useState([]);
  const [firstWindows, setFirstWindows] = useState("");
  const { id } = useParams();
  const [windowName, setwindowName] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const [role, setRole] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/window/getWindow/${id}`)
      .then((res) => {
        const rawData = res.data.windows;
        if (rawData) {
          const tempData = rawData.map((item) => ({
            id: item.id,
            idComponent: item.idComponent,
            component: APP_FUNCTIONS[item.component].component,
            data: item.data,
          }));
          const tempData2 = rawData.map((item) => ({
            id: item.id,
            idComponent: item.idComponent,
            component: APP_FUNCTIONS[item.component].component,
            data: item.data,
          }));
          setWindows([...tempData]);
          setInitWindows([...tempData2]);
          setFirstWindows(JSON.stringify(tempData));
        }
        setwindowName(res.data.name);
        setisLoading(false);
        setRole(res.data.role);
        return res.data.createBy;
      })
      .then((createBy) => {
        axios
          .get(`${process.env.REACT_APP_API_URL}/user/getUserById/${createBy}`)
          .then((response) => {
            dispatch(getThisAdmin(response.data.username));
          });
      })
      .catch(() => {
        alert("Lỗi khi tải dữ liệu");
      });
  }, [id, dispatch]);

  return (
    <>
      <Header />
      {isLoading ? (
        <CircularProgress sx={{ marginTop: 20 }} size={80} />
      ) : (
        <Container maxWidth="xl">
          <dataContext.Provider
            value={{
              windows,
              setWindows,
              firstWindows,
              setFirstWindows,
              initWindows,
              windowName,
              role,
            }}
          >
            <IconBreadcrumbs />
            <ToolBar />
          </dataContext.Provider>
        </Container>
      )}
    </>
  );
}
