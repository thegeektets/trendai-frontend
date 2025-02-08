/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../utils/api";

interface SubmissionState {
  loading: boolean;
  submissions: any[]; // Array to store fetched submissions
  submission: any; // Single submission (for submission actions)
  error: string | null;
}

const initialState: SubmissionState = {
  loading: false,
  submissions: [], // Initialize as an empty array
  submission: null,
  error: null,
};

// Async thunk to update a submission by ID
export const updateSubmission = createAsyncThunk(
  "submission/updateSubmission",
  async (
    { id, status, approver }: { id: string; status: string; approver: string },
    thunkAPI,
  ) => {
    try {
      const response = await apiRequest(`submissions/${id}`, "PUT", {
        status,
        approver,
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// Async thunk for submission
export const submitSubmission = createAsyncThunk(
  "submission/submitSubmission",
  async (
    submissionData: { contentLink: string; likes: number; comments: number },
    thunkAPI,
  ) => {
    try {
      const response = await apiRequest("submissions", "POST", submissionData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// Async thunk to fetch submissions by brand ID
export const fetchSubmissionsByBrand = createAsyncThunk(
  "submission/fetchSubmissionsByBrand",
  async (brandId: string, thunkAPI) => {
    try {
      const response = await apiRequest(`submissions/brand/${brandId}`, "GET");
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// Async thunk to fetch submissions by influencer ID
export const fetchSubmissionsByInfluencer = createAsyncThunk(
  "submission/fetchSubmissionsByInfluencer",
  async (influencerId: string, thunkAPI) => {
    try {
      const response = await apiRequest(
        `submissions/influencer/${influencerId}`,
        "GET",
      );
      return response;
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
      // Handle submitSubmission
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
      })

      // Handle fetchSubmissionsByBrand
      .addCase(fetchSubmissionsByBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionsByBrand.fulfilled, (state, action: any) => {
        state.loading = false;
        state.submissions = action.payload; // Store fetched submissions
        state.error = null;
      })
      .addCase(fetchSubmissionsByBrand.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch submissions by brand. Please try again.";
      })

      // Handle fetchSubmissionsByInfluencer
      .addCase(fetchSubmissionsByInfluencer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionsByInfluencer.fulfilled, (state, action: any) => {
        state.loading = false;
        state.submissions = action.payload; // Store fetched submissions
        state.error = null;
      })
      .addCase(fetchSubmissionsByInfluencer.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch submissions by influencer. Please try again.";
      })
      .addCase(updateSubmission.fulfilled, (state, action: any) => {
        state.submissions = state.submissions.map((submission) =>
          submission.id === action.payload.id ? action.payload : submission,
        );
      })
      .addCase(updateSubmission.rejected, (state, action: any) => {
        state.error = action.payload || "Failed to update submission";
      });
  },
});

export default submissionSlice.reducer;
