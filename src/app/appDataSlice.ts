import { createSlice } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";

interface AppDataState {
  navigationState: string | undefined;
  themeMode: ThemeMode;
}

const initialState: AppDataState = {
  navigationState: undefined,
  themeMode: "system",
};

export const appDataSlice = createSlice({
  name: "appData",
  initialState,
  reducers: {
    navigationStateChanged: (state, action) => {
      state.navigationState = action.payload;
    },
    themeModeChanged: (state, action) => {
      state.themeMode = action.payload;
    },
    reset: () => initialState,
  },
  extraReducers: (builder) => {},
});

export const { reset, navigationStateChanged, themeModeChanged } =
  appDataSlice.actions;

export default appDataSlice.reducer;
