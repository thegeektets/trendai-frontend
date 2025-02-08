/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../utils/api";

interface SubmissionState {
  loading: boolean;
  submission: any;
  error: string | null;
}

const initialState: SubmissionState = {
  loading: false,
  submission: null,
  error: null,
};

// Async thunk for submission
export const submitSubmission = createAsyncThunk(
  "submission/submitSubmission",
  async (
    submissionData: { contentLink: string; likes: number; comments: number },
    thunkAPI,
  ) => {
    try {
      const response = await apiRequest("submissions", "POST", submissionData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

const submissionSlice = createSlice({
  name: "submission",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitSubmission.fulfilled, (state, action: any) => {
        state.loading = false;
        state.submission = action.payload;
        state.error = null;
      })
      .addCase(submitSubmission.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || "Submission failed. Please try again.";
      });
  },
});

export default submissionSlice.reducer;
