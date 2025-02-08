/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../utils/api";

interface InfluencerState {
  loading: boolean;
  error: string | null;
  profile: any;
}

const initialState: InfluencerState = {
  loading: false,
  error: null,
  profile: null,
};

// Async action to submit influencer setup data
export const setupInfluencerProfile = createAsyncThunk(
  "influencer/submitProfile",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await apiRequest("influencers", "POST", data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message || "Failed to submit influencer profile",
      );
    }
  },
);

const influencerSlice = createSlice({
  name: "influencer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setupInfluencerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setupInfluencerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(setupInfluencerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default influencerSlice.reducer;
