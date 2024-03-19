import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store/store";

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  isAuthenticated: localStorage.getItem("token") ? true : false,
  isAdmin: localStorage.getItem("isAdmin") === "true" ? true : false,
};

export const authSlice = createSlice({
  name: "authentication",
  initialState: initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.isAdmin;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("isAdmin", action.payload.isAdmin.toString());
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
    },
  },
});

export const authActions = authSlice.actions;

export const selectToken = (state: AppState) => state.auth.token;

export const selectIsAdmin = (state: AppState) => state.auth.isAdmin;

export const selectIsAuthenticated = (state: AppState) =>
  state.auth.isAuthenticated;

export default authSlice.reducer;
