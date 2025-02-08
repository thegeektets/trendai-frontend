import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import influencerReducer from "./slices/influencerSlice";
import brandReducer from "./slices/brandSlice";
import campaignReducer from "./slices/brandSlice";
import submissionReducer from "./slices/submissionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    influencer: influencerReducer,
    brand: brandReducer,
    campaign: campaignReducer,
    submission: submissionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
