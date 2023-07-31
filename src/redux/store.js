import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userReducer, adminReducer } from "./reducer/userReducer";

const rootReducer = combineReducers({
    user: userReducer,
    admin: adminReducer
});

const store = configureStore({ reducer: rootReducer });
export default store;
