import { GET_CURRENT_USER, GET_THIS_ADMIN } from "../../utils/constants";

export const userReducer = (state = "", action) => {
  switch (action.type) {
    case GET_CURRENT_USER:
      return action.payload;
    default:
      return state;
  }
};

export const adminReducer = (state = "", action) => {
  switch (action.type) {
    case GET_THIS_ADMIN:
      return action.payload;
    default:
      return state;
  }
};
