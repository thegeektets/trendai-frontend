/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../utils/api";

interface BrandState {
  loading: boolean;
  error: string | null;
  brand: any;
}

const initialState: BrandState = {
  loading: false,
  error: null,
  brand: null,
};

export const setupBrandProfile = createAsyncThunk(
  "brand/setupBrandProfile",
  async (brandData: any, { rejectWithValue }) => {
    try {
      const response = await apiRequest("brands", "POST", brandData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setupBrandProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setupBrandProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.brand = action.payload;
      })
      .addCase(setupBrandProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default brandSlice.reducer;
