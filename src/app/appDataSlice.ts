import { createSlice } from "@reduxjs/toolkit";

interface AppDataState {}

const initialState: AppDataState = {};

export const appDataSlice = createSlice({
  name: "appData",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {},
});

export const { reset } = appDataSlice.actions;

export default appDataSlice.reducer;
