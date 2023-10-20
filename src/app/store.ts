import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "../api/apiSlice";
import { rootReducer } from "./storage";

export const store = configureStore({
  reducer: {
    appData: rootReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  devTools: true,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
