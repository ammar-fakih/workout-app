import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Units, Workout } from "./types";
import { RootState } from "../../app/store";

interface WorkoutsState {
  allWorkouts: Workout[][];
  todaysWorkouts: Workout[];
  units: Units;
}

const initialState: WorkoutsState = {
  allWorkouts: [],
  todaysWorkouts: [],
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
    todaysWorkoutsSet: (
      state,
      action: PayloadAction<{ dayNum: number; time: number }>,
    ) => {
      state.todaysWorkouts = state.allWorkouts[action.payload.dayNum].filter(
        (workout) => {
          const startDate = new Date(workout.startDate);

          const weeksBetween = Math.floor(
            (action.payload.time - startDate.getTime()) /
              (1000 * 60 * 60 * 24 * 7),
          );

          return weeksBetween % workout.frequency === 0;
        },
      );

      state.allWorkouts[7].forEach((workout) => {
        const startDate = new Date(workout.startDate);

        const daysBetween = Math.floor(
          (action.payload.time - startDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (daysBetween % workout.frequency === 0) {
          state.todaysWorkouts.push(workout);
        }
      });
    },
  },
  extraReducers: (builder) => {},
});

// Selectors
export const selectWorkouts = (state: RootState) =>
  state.appData.workouts.allWorkouts;

export const selectTodaysWorkouts = (state: RootState) =>
  state.appData.workouts.todaysWorkouts;
// Actions
export const { reset, userDataReadFromFile, todaysWorkoutsSet } =
  workoutsSlice.actions;

export default workoutsSlice.reducer;
