import { createSlice } from "@reduxjs/toolkit";
import { apiRequestStarted } from "./actions";

const slice = createSlice({
  name: "users",

  initialState: {
    loggedIn: false,
    loggedOut: false,
    registered: false,
    user: {
      name: "",
      username: "",
      role: "",
    },
    error: "",
    message: "",
  },

  reducers: {
    userLoggedIn: (users, { payload }) => {
      let { token } = payload.data;

      //set user info in redux
      users.loggedIn = true;
      users.loggedOut = false;

      //set user info in session storage
      sessionStorage.setItem("token", token);

      //reset possible previous info
      users.error = "";
      users.message = "";
    },

    userRegistered: (users, { payload }) => {
      users.registered = true;
      users.error = "";
    },

    userLoggedOut: (users, { payload }) => {
      //reset user info in redux
      users.loggedIn = false;
      users.loggedOut = true;

      //clear session storage
      sessionStorage.clear();
    },

    //Resets all error messages left behind. Dispatch on onmount.
    messageReset: (users, { payload }) => {
      users.message = "";
      users.error = "";
      users.registered = false;
    },

    gotError: (users, { payload }) => {
      users.error = payload;
    },
  },
});

export const userLogin = (url, data, method) => (dispatch, getState) => {
  dispatch(
    apiRequestStarted({
      url,
      data,
      method,
      onSuccess: userLoggedIn.type,
      onError: gotError.type,
    })
  );
};

export const userRegister = (url, data, method) => (dispatch, getState) => {
  dispatch(
    apiRequestStarted({
      url,
      data,
      method,
      onSuccess: userRegistered.type,
      onError: gotError.type,
    })
  );
};

export const { userLoggedIn, userRegistered, userLoggedOut, gotError, messageReset } = slice.actions;
export default slice.reducer;
