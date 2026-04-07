import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

interface AuthState {
  isAuthenticated: boolean;
  doctor: Doctor | null;
}

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  doctor: JSON.parse(localStorage.getItem("doctor") || "null"),
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (
      state,
      action: PayloadAction<{
        isAuthenticated: boolean;
        doctor?: Doctor | null;
      }>,
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.doctor = action.payload.doctor ?? null;

      localStorage.setItem(
        "isAuthenticated",
        String(action.payload.isAuthenticated),
      );

      if (action.payload.doctor) {
        localStorage.setItem("doctor", JSON.stringify(action.payload.doctor));
      } else {
        localStorage.removeItem("doctor");
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.doctor = null;

      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("doctor");
    },
  },
});

export const { setAuthState, logout } = slice.actions;

export default slice.reducer;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectDoctor = (state: RootState) => state.auth.doctor;