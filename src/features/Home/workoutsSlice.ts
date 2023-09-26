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
  selectedSet: [number, number] | null;
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
  selectedSet: [0, 0],
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
        // @ts-expect-error Typing is off but its just for development
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
    todaysWorkoutsSet: (state) => {
      if (!state.weeksWorkouts) return;
      const day = new Date().getDay();

      const todaysWorkout = state.weeksWorkouts.find((workout) => {
        const startDate = new Date(workout.closestTimeToNow);

        return startDate.getDay() === day;
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
    exerciseWeightChanged: (
      state: WorkoutsState,
      action: PayloadAction<{
        newWeight?: number;
        weightChange?: number;
        exerciseId: string;
      }>,
    ) => {
      const { newWeight, weightChange, exerciseId } = action.payload;
      if (!state.selectedWorkout || (!weightChange && !newWeight)) return;

      const exercise = state.selectedWorkout?.exercises.find(
        (exercise) => exercise.id === exerciseId,
      );
      if (!exercise) return;

      if (weightChange) {
        exercise.weight += weightChange;
      } else if (newWeight) {
        exercise.weight = newWeight;
      }
    },
    // Track WorkoutPage
    onPressNextSet: (state) => {
      if (!state.selectedWorkout || !state.selectedSet) return;

      const [exerciseIndex, setIndex] = state.selectedSet;
      const exercises = state.selectedWorkout.exercises;
      const exercise = exercises[exerciseIndex];

      if (setIndex === exercise.sets - 1) {
        if (exerciseIndex === exercises.length - 1) {
          state.selectedSet = null;
        } else {
          state.selectedSet = [exerciseIndex + 1, 0];
        }
      } else {
        state.selectedSet = [exerciseIndex, setIndex + 1];
      }
    },
    onPressPreviousSet: (state) => {
      if (!state.selectedWorkout || !state.selectedSet) return;

      const [exerciseIndex, setIndex] = state.selectedSet;
      const exercises = state.selectedWorkout.exercises;
      const exercise = exercises[exerciseIndex];

      if (setIndex === 0) {
        state.selectedSet = [
          exerciseIndex - 1,
          exercise.completedSets.length - 1,
        ];
      } else {
        state.selectedSet = [exerciseIndex, setIndex - 1];
      }
    },
    onPressExercise: (state, action: PayloadAction<number>) => {
      if (!state.selectedWorkout) return;

      const exerciseIndex = action.payload;

      if (exerciseIndex === state.selectedSet?.[0]) return;

      state.selectedSet = [exerciseIndex, 0];
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
  exerciseWeightChanged,
  onPressNextSet,
  onPressPreviousSet,
  onPressExercise,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
