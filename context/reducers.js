import { setCookie, deleteCookie } from "cookies-next";
import { initialState } from "./index";
import {domain} from "../config/config"

export const UserReducer = (state, action) => {
  switch (action.type) {
    case "SETISLOADING":
      return { ...state, isLoading: action.payload.isLoading };
    case "LOGGEDIN":
      setCookie("userMonlech", action.payload.jwt, {
        path: "/",
        domain,
        maxAge: 3600, // Expires after 1hr
        sameSite: true,
      });
      return { ...state, ...action.payload };
    case "RELOADING":
      return { ...state, ...action.payload };
    case "GETUSER":
      return state.user;
    case "LOGOUT":
      try {
        deleteCookie("userMonlech", {
          path: "/",
          domain,
        });
      } catch (error) {}
      return { ...state, ...initialState };
  }
};
