import "./App.css";
import SettingPage from "./pages/SettingPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import store from "./redux/store";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <CssBaseline />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/work/:id"
            element={
              <PrivateRoute>
                <SettingPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
