import { configureStore } from "@reduxjs/toolkit";

import { rootReducer } from "./storage";
import { apiSlice } from "../api/apiSlice";

export const store = configureStore({
  reducer: {
    appData: rootReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
