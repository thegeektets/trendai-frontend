/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../utils/api";

// Define the state shape
interface CampaignState {
  campaigns: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: [],
  loading: false,
  error: null,
};

// Thunk to create a campaign
export const createCampaign = createAsyncThunk(
  "campaign/createCampaign",
  async (campaignData: any, { rejectWithValue }) => {
    try {
      const response = await apiRequest("campaigns", "POST", campaignData);
      return response;
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to create submission";
      console.log("errorMessage", errorMessage);
      throw rejectWithValue(errorMessage);
    }
  },
);

// Thunk to fetch campaigns by brand ID
export const getCampaignsByBrand = createAsyncThunk(
  "campaign/getCampaignsByBrand",
  async (brandId: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`campaigns/brand/${brandId}`, "GET");
      return response;
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to fetch campaigns";
      console.log("errorMessage", errorMessage);
      throw rejectWithValue(errorMessage);
    }
  },
);

// Thunk to fetch all campaigns
export const getAllCampaigns = createAsyncThunk(
  "campaign/getAllCampaigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("campaigns", "GET");
      return response; // Assuming response contains the campaigns
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to fetch all campaigns";
      console.log("errorMessage", errorMessage);
      throw rejectWithValue(errorMessage);
    }
  },
);

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle createCampaign lifecycle
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.loading = false;
        state.campaigns.push(action.payload);
      })
      .addCase(createCampaign.rejected, (state, action) => {
        console.log("action.payload", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle getAllCampaigns lifecycle
      .addCase(getAllCampaigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCampaigns.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.loading = false;
        state.campaigns = action.payload; // Replace campaigns with fetched data
      })
      .addCase(getAllCampaigns.rejected, (state, action) => {
        console.log("action.payload", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle getCampaignsByBrand lifecycle
      .addCase(getCampaignsByBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCampaignsByBrand.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.loading = false;
        state.campaigns = action.payload; // Replace campaigns with fetched data
      })
      .addCase(getCampaignsByBrand.rejected, (state, action) => {
        console.log("action.payload", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the reducer to be used in the store
export default campaignSlice.reducer;
