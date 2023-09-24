import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import {
  getClosestDate,
  getCurrentWeekRangeTime,
  getDefaultWeight,
} from "./helperFunctions";
import {
  ExerciseRecords,
  GeneralWorkout,
  Program,
  ProgramFromFile,
  TodaysWorkout,
  Units,
  Workout,
} from "./types";

interface WorkoutsState {
  allPrograms: Program[];
  allWorkouts: GeneralWorkout[];
  selectedProgram: Program | undefined;
  weeksWorkouts: TodaysWorkout[];
  todaysWorkout: TodaysWorkout | undefined;
  selectedWorkout: TodaysWorkout | undefined;
  exerciseRecords: ExerciseRecords;
  units: Units;
}

const initialState: WorkoutsState = {
  allPrograms: [],
  allWorkouts: [],
  selectedProgram: undefined,
  weeksWorkouts: [],
  todaysWorkout: undefined,
  selectedWorkout: undefined,
  exerciseRecords: {},
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
                completed: false,
                exercises: currentWorkout.exercises.map((exercise) => {
                  return {
                    ...exercise,
                    completedSets: Array(exercise.sets).fill({
                      repCount: exercise.reps,
                      selected: false,
                    }),
                    weight: getNextWeight(state, exercise.id),
                  };
                }),
              },
            ];
          } else {
            return accumulator;
          }
        },
        [] as TodaysWorkout[],
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

      state.todaysWorkout = todaysWorkout as TodaysWorkout;
    },
    workoutSelected: (state, action: PayloadAction<TodaysWorkout>) => {
      state.selectedWorkout = action.payload;
    },
    exerciseSetClicked: (
      state,
      action: PayloadAction<{
        exerciseIndex: number;
        exerciseSetIndex: number;
      }>,
    ) => {
      if (!state.selectedWorkout) return;

      const { exerciseIndex, exerciseSetIndex } = action.payload;

      const exercise = state.selectedWorkout.exercises[exerciseIndex];
      const exerciseSet = exercise.completedSets[exerciseSetIndex];

      if (exerciseSet.repCount === exercise.reps && !exerciseSet.selected) {
        exerciseSet.selected = true;
      } else if (exerciseSet.selected && exerciseSet.repCount === 0) {
        exerciseSet.repCount = exercise.reps;
        exerciseSet.selected = false;
      } else {
        exerciseSet.repCount--;
        exerciseSet.selected = true;
      }
    },
    workoutFinished: (state) => {
      if (!state.selectedWorkout) return;

      const updatedWorkout = state.selectedWorkout.exercises.map((exercise) => {
        // Update Records
        if (!state.exerciseRecords[exercise.id]) {
          state.exerciseRecords[exercise.id] = [];
        }
        state.exerciseRecords[exercise.id].push({
          date: new Date().toISOString(),
          weight: exercise.weight,
          completedSets: exercise.completedSets,
        });

        // Clear completed sets
        return {
          ...exercise,
          completedSets: exercise.completedSets.map((_) => {
            return {
              repCount: exercise.reps,
              selected: false,
            };
          }),
        };
      });

      state.selectedWorkout = {
        ...state.selectedWorkout,
        completed: true,
        exercises: updatedWorkout,
      };
    },
  },
});

// Private Helper functions
const getNextWeight = (state: WorkoutsState, exerciseId: string) => {
  if (!state.exerciseRecords[exerciseId]) {
    return getDefaultWeight(state.units);
  }

  return state.exerciseRecords[exerciseId][
    state.exerciseRecords[exerciseId].length - 1
  ].weight;
};

// Selectors
export const selectWorkouts = (state: RootState) =>
  state.appData.workouts.allWorkouts;
export const selectTodaysWorkouts = (state: RootState) =>
  state.appData.workouts.todaysWorkout;
export const selectWeeksWorkouts = (state: RootState) =>
  state.appData.workouts.weeksWorkouts;
export const selectSelectedWorkout = (state: RootState) =>
  state.appData.workouts.selectedWorkout;
export const selectExerciseRecords = (state: RootState) =>
  state.appData.workouts.exerciseRecords;

// Actions
export const {
  reset,
  programReadFromFile,
  workoutsReadFromFiles,
  todaysWorkoutsSet,
  weeksWorkoutsSet,
  workoutSelected,
  exerciseSetClicked,
  workoutFinished,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
