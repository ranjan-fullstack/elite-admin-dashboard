import { createSlice } from "@reduxjs/toolkit";

/* 🔥 Get Saved Auth From localStorage */
const savedAuth = JSON.parse(localStorage.getItem("auth"));

const initialState = savedAuth || {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* 🔥 LOGIN SUCCESS */
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      // Save full auth object
      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isAuthenticated: true,
        })
      );
    },

    /* 🔥 UPDATE ACCESS TOKEN (After Refresh) */
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          ...state,
          accessToken: action.payload,
        })
      );
    },

    /* 🔥 LOGOUT */
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("auth");
    },
  },
});

export const {
  loginSuccess,
  logout,
  updateAccessToken,
} = authSlice.actions;

export default authSlice.reducer;
