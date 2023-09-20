import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Units, Workout } from "./types";
import { RootState } from "../../app/store";

interface WorkoutsState {
  allWorkouts: Workout[];
  todaysWorkout: Workout | undefined;
  selectedWorkout: Workout | undefined;
  weeksWorkouts: Workout[];
  units: Units;
}

const initialState: WorkoutsState = {
  allWorkouts: [],
  todaysWorkout: undefined,
  selectedWorkout: undefined,
  weeksWorkouts: [],
  units: Units.IMPERIAL,
};

export const workoutsSlice = createSlice({
  name: "workouts",
  initialState,
  reducers: {
    reset: () => initialState,
    userDataReadFromFile: (state, action: PayloadAction<Workout[]>) => {
      state.allWorkouts = action.payload;
    },
    weeksWorkoutsSet: (
      state,
      action: PayloadAction<{ dayNum: number; time: number }>,
    ) => {
      state.weeksWorkouts = state.allWorkouts.filter((workout) => {
        const startDate = new Date(workout.startDate);

        const weeksBetween = Math.floor(
          (action.payload.time - startDate.getTime()) /
            (1000 * 60 * 60 * 24 * 7),
        );
        return weeksBetween % workout.frequency === 0;
      });
    },
    todaysWorkoutsSet: (
      state,
      action: PayloadAction<{ dayNum: number; time: number }>,
    ) => {
      state.todaysWorkout = state.allWorkouts.find((workout) => {
        const startDate = new Date(workout.startDate);

        const daysBetween = Math.floor(
          (action.payload.time - startDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        return daysBetween % workout.frequency === 0;
      });
    },
  },
  extraReducers: (builder) => {},
});

// Selectors
export const selectWorkouts = (state: RootState) =>
  state.appData.workouts.allWorkouts;

export const selectTodaysWorkouts = (state: RootState) =>
  state.appData.workouts.todaysWorkout;

export const selectWeeksWorkouts = (state: RootState) =>
  state.appData.workouts.weeksWorkouts;

export const selectSelectedWorkout = (state: RootState) =>
  state.appData.workouts.selectedWorkout;

// Actions
export const {
  reset,
  userDataReadFromFile,
  todaysWorkoutsSet,
  weeksWorkoutsSet,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
