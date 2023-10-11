import { createSlice } from "@reduxjs/toolkit";

interface AppDataState {
  navigationState: string | undefined;
}

const initialState: AppDataState = {
  navigationState: undefined,
};

export const appDataSlice = createSlice({
  name: "appData",
  initialState,
  reducers: {
    navigationStateChanged: (state, action) => {
      state.navigationState = action.payload;
    },
    reset: () => initialState,
  },
  extraReducers: (builder) => {},
});

export const { reset, navigationStateChanged } = appDataSlice.actions;

export default appDataSlice.reducer;
