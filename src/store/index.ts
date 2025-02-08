import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import influencerReducer from "./slices/influencerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    influencer: influencerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
