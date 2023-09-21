import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import {
  GeneralWorkout,
  Program,
  ProgramFromFile,
  TodaysExercise,
  TodaysWorkout,
  Units,
  Workout,
} from "./types";
import { RootState } from "../../app/store";
import { getClosestDate, getCurrentWeekRangeTime } from "./helperFunctions";

interface WorkoutsState {
  allPrograms: Program[];
  allWorkouts: GeneralWorkout[];
  selectedProgram: Program | undefined;
  weeksWorkouts: Workout[];
  todaysWorkout: TodaysWorkout | undefined;
  selectedWorkout: Workout | undefined;
  units: Units;
}

const initialState: WorkoutsState = {
  allPrograms: [],
  allWorkouts: [],
  selectedProgram: undefined,
  weeksWorkouts: [],
  todaysWorkout: undefined,
  selectedWorkout: undefined,
  units: Units.IMPERIAL,
};

export const workoutsSlice = createSlice({
  name: "workouts",
  initialState,
  reducers: {
    reset: () => initialState,
    // !USED FOR DEVELOPMENT ONLY
    workoutsReadFromFiles: (state, action: PayloadAction<GeneralWorkout[]>) => {
      state.allWorkouts = action.payload;
    },
    // !USED FOR DEVELOPMENT ONLY
    programReadFromFile: (state, action: PayloadAction<ProgramFromFile>) => {
      let updatedWorkouts: Workout[] = [];

      try {
        updatedWorkouts = action.payload.workouts.map((workout) => {
          const genWorkout = state.allWorkouts.find(
            (w) => w.id === workout.workoutId,
          );
          if (!genWorkout)
            throw new Error("Workout not found: id " + workout.id);

          return { ...genWorkout, ...workout };
        });
      } catch (e) {
        console.warn(e);
        return;
      }

      const updatedProgram: Program = {
        ...action.payload,
        workouts: updatedWorkouts,
      };
      state.allPrograms = [updatedProgram];
      state.selectedProgram = updatedProgram;
    },

    weeksWorkoutsSet: (state) => {
      if (!state.selectedProgram) return;
      const { sunday, saturday } = getCurrentWeekRangeTime();

      let numIntervals: number | undefined = undefined;

      // Filter out workouts that are not in the current week and add closestTimeToNow
      state.weeksWorkouts = state.selectedProgram.workouts.reduce(
        (accumulator, currentWorkout) => {
          const { closestTimeToNow, newNumIntervals } = getClosestDate(
            currentWorkout.startDate,
            currentWorkout.frequency,
            numIntervals,
          );
          if (!numIntervals) {
            numIntervals = newNumIntervals;
          }
          const closestTime = closestTimeToNow.getTime();
          if (
            closestTime >= sunday.getTime() &&
            closestTime <= saturday.getTime()
          ) {
            return [
              ...accumulator,
              {
                ...currentWorkout,
                closestTimeToNow: closestTimeToNow.toISOString(),
              },
            ];
          } else {
            return accumulator;
          }
        },
        [] as Workout[],
      );
    },
    todaysWorkoutsSet: (
      state,
      action: PayloadAction<{ dayNum: number; time: number }>,
    ) => {
      if (!state.selectedProgram) return;

      const todaysWorkout = state.selectedProgram.workouts.find((workout) => {
        const startDate = new Date(workout.startDate);

        const daysBetween = Math.floor(
          (action.payload.time - startDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        return daysBetween % workout.frequency === 0;
      });

      if (!todaysWorkout) return;

      const exercises: TodaysExercise = todaysWorkout.exercises.map(
        (exercise) => {
          const completedSets = Array(exercise.sets).fill(exercise.reps);
          return { ...exercise, completedSets };
        },
      );

      state.todaysWorkout = todaysWorkout;
    },
  },
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
  programReadFromFile,
  workoutsReadFromFiles,
  todaysWorkoutsSet,
  weeksWorkoutsSet,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
