import { configureStore } from "@reduxjs/toolkit";

import { rootReducer } from "./storage";
import { apiSlice } from "../api/apiSlice";

export const store = configureStore({
  reducer: {
    appData: rootReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
