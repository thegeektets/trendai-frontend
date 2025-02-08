import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiRequest } from "../../utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
// Define the shape of the campaign data
interface Campaign {
  _id: string;
  name: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: "active" | "paused" | "completed";
  brand: string;
}

// Define the state shape
interface CampaignState {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: [],
  loading: false,
  error: null,
};

export const createCampaign = createAsyncThunk(
  "campaigns/createCampaign",
  async (campaignData: Campaign, { rejectWithValue }) => {
    try {
      const response = await apiRequest("campaigns", "POST", campaignData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data || error.message);
    }
  },
);

const campaignSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCampaign.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns.push(action.payload);
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions for dispatching
export const {} = campaignSlice.actions;

// Export the reducer to be used in the store
export default campaignSlice.reducer;
