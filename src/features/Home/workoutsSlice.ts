import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Units, Workout } from "./types";
import { RootState } from "../../app/store";

interface WorkoutsState {
  allWorkouts: Workout[][];
  units: Units;
}

const initialState: WorkoutsState = {
  allWorkouts: [],
  units: Units.IMPERIAL,
};

export const workoutsSlice = createSlice({
  name: "workouts",
  initialState,
  reducers: {
    reset: () => initialState,
    userDataReadFromFile: (state, action: PayloadAction<Workout[][]>) => {
      state.allWorkouts = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

// Selectors
export const selectWorkouts = (state: RootState) =>
  state.appData.workouts.allWorkouts;

// Actions
export const { reset, userDataReadFromFile } = workoutsSlice.actions;

export default workoutsSlice.reducer;
