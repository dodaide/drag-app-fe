import { GET_CURRENT_USER, GET_THIS_ADMIN } from "../../utils/constants";

export const getCurrentUser = (user) => {
  return {
    type: GET_CURRENT_USER,
    payload: user,
  };
};

export const getThisAdmin = (admin) => {
  return {
    type: GET_THIS_ADMIN,
    payload: admin,
  };
};
