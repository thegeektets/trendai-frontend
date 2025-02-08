/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../utils/api";

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  loading: false,
  error: null,
};

// Thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    userData: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      localStorage.removeItem("token");

      const response = await apiRequest("auth/login", "POST", userData);

      console.log("response", response);

      localStorage.setItem("token", response.accessToken || null);
      localStorage.setItem("user", JSON.stringify(response.user));

      return response;
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  },
);

// Thunk for signup
export const signupUser = createAsyncThunk(
  "users/register",
  async (
    userData: { email: string; password: string; role: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiRequest("users/register", "POST", userData);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || "Signup failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  },
);

export const clearAuthError = () => (dispatch: any) => {
  dispatch(authSlice.actions.clearError());
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
