import {
  PayloadAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import {
  DEFAULT_PLATES_IMPERIAL,
  DEFAULT_PLATES_METRIC,
  DEFAULT_WEIGHT_IMPERIAL,
  DEFAULT_WEIGHT_METRIC,
} from "./constants";
import {
  BodyWeightRecord,
  ExerciseRecord,
  GeneralWorkout,
  Program,
  ProgramFromFile,
  SelectedWorkout,
  TodaysWorkout,
  Units,
  Workout,
  WorkoutRecord,
} from "./types";

const BodyWeightRecordAdapter = createEntityAdapter({
  selectId: (record: BodyWeightRecord) => record.date,
  sortComparer: (a, b) => a.date.localeCompare(b.date),
});

interface WorkoutsState {
  allPrograms: Program[];
  allWorkouts: GeneralWorkout[];
  selectedProgram: Program | undefined;
  weeksWorkouts: TodaysWorkout[];
  todaysWorkout: TodaysWorkout | undefined;

  // TrackWorkoutPage
  selectedWorkout: SelectedWorkout | undefined;
  selectedSet: [number, number] | null;
  stopWatchStartTime: number | null;
  stopWatchExtraSeconds: number; // When paused, add time to this value

  // Records
  allRecords: ExerciseRecord[];
  exerciseRecords: {
    // Map exercise name to record entries in allRecords
    [name: string]: number[];
  };
  workoutRecords: WorkoutRecord[]; // record of all workouts (groups of exercises); maps to allRecords

  units: Units;
}

const initialState: WorkoutsState &
  ReturnType<typeof BodyWeightRecordAdapter.getInitialState> = {
  allPrograms: [],
  allWorkouts: [],
  selectedProgram: undefined,
  weeksWorkouts: [],
  todaysWorkout: undefined,

  selectedWorkout: undefined,
  selectedSet: [0, 0],

  allRecords: [],
  exerciseRecords: {},
  workoutRecords: [],
  stopWatchStartTime: null,
  stopWatchExtraSeconds: 0,

  units: Units.IMPERIAL,

  ...BodyWeightRecordAdapter.getInitialState(),
};

export const workoutsSlice = createSlice({
  name: "workouts",
  initialState,
  reducers: {
    reset: () => initialState,
    appOpened: (
      state,
      action: PayloadAction<{
        startingWorkouts: GeneralWorkout[];
        startingProgram: ProgramFromFile;
      }>,
    ) => {
      workoutsSlice.caseReducers.workoutsReadFromFiles(state, {
        payload: action.payload.startingWorkouts,
        type: typeof action.payload.startingWorkouts,
      });
      workoutsSlice.caseReducers.programReadFromFile(state, {
        payload: action.payload.startingProgram,
        type: typeof action.payload.startingProgram,
      });
      workoutsSlice.caseReducers.weeksWorkoutsSet(state);
      workoutsSlice.caseReducers.todaysWorkoutsSet(state);
    },
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
    unitsSet: (state, action: PayloadAction<Units>) => {
      state.units = action.payload;

      // Update current workouts
      state.weeksWorkouts = state.weeksWorkouts.map((workout) => ({
        ...workout,
        exercises: workout.exercises.map((exercise) => ({
          ...exercise,
          weight: getNextWeight(state, exercise.id),
        })),
      }));

      state.todaysWorkout = state.todaysWorkout && {
        ...state.todaysWorkout,
        exercises: state.todaysWorkout.exercises.map((exercise) => ({
          ...exercise,
          weight: getNextWeight(state, exercise.id),
        })),
      };

      state.selectedWorkout = state.selectedWorkout && {
        ...state.selectedWorkout,
        exercises: state.selectedWorkout.exercises.map((exercise) => ({
          ...exercise,
          weight: roundUnits(
            convertUnits(exercise.weight, action.payload),
            action.payload,
          ),
        })),
      };
    },
    weeksWorkoutsSet: (state) => {
      if (!state.selectedProgram) return;

      const todayNum = new Date().getDay();

      // map workouts to days of the week
      const workoutsPerDay = Array.from(
        { length: 7 },
        (_) => [],
      ) as Workout[][];
      state.selectedProgram.workouts.forEach((workout) => {
        const day = new Date(workout.startDate).getUTCDay();
        workoutsPerDay[day].push(workout);
      });

      // Create a date object for each day of the week
      const daysOfThisWeek = new Array(7).fill(0).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - todayNum + i);
        return date;
      });

      const weeksWorkouts = [] as TodaysWorkout[];
      daysOfThisWeek.forEach((date, i) => {
        workoutsPerDay[i].forEach((workout) => {
          // calculate number of days between date and workout date
          const workoutDate = new Date(workout.startDate);
          const diff = Math.abs(workoutDate.getTime() - date.getTime());
          const daysBetween = Math.ceil(diff / (1000 * 60 * 60 * 24));
          const weeks = Math.floor(daysBetween / 7);

          if (weeks % workout.frequency === 0) {
            weeksWorkouts.push({
              ...workout,
              closestTimeToNow: date.toISOString(),
              completed: false,
              exercises: workout.exercises.map((exercise) => {
                return {
                  ...exercise,
                  completedSets: Array(exercise.sets).fill({
                    repCount: exercise.reps,
                    selected: false,
                  }),
                  weight: getNextWeight(state, exercise.id),
                };
              }),
            });
          }
        });
      });

      state.weeksWorkouts = weeksWorkouts;
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
      state.selectedWorkout = {
        ...action.payload,
        notes: "",
        exercises: action.payload.exercises.map((exercise) => ({
          ...exercise,
          startingWeight: exercise.weight,
        })),
      };

      workoutsSlice.caseReducers.stopWatchStarted(state);
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

      // Calculate total time (seconds)
      const currentTime = new Date().getTime();
      const startTime = state.stopWatchStartTime || currentTime;
      const totalTime = Math.round(
        (currentTime - startTime) / 1000 + state.stopWatchExtraSeconds,
      );

      const exerciseRecord: WorkoutRecord["exercises"] = [];

      state.selectedWorkout.exercises.forEach((exercise) => {
        // Push to allrecords
        state.allRecords.push({
          date: new Date().toISOString(),
          weight: exercise.weight,
          completedSets: exercise.completedSets,
          sets: exercise.sets,
          reps: exercise.reps,
          name: exercise.name,
          id: exercise.id,
        });

        // Update exercise records
        if (!state.exerciseRecords[exercise.name]) {
          state.exerciseRecords[exercise.name] = [];
        }
        state.exerciseRecords[exercise.name].push(state.allRecords.length - 1);

        // Save value for workout record
        exerciseRecord.push(state.allRecords.length - 1);
      });

      // Push to workout records
      state.workoutRecords.push({
        exercises: exerciseRecord,
        name: state.selectedWorkout.name,
        notes: state.selectedWorkout.notes,
        timeToComplete: totalTime,
      });
      state.selectedSet = workoutsSlice.getInitialState().selectedSet;

      state.selectedWorkout = workoutsSlice.getInitialState().selectedWorkout;

      // Update frontpage with new weights
      workoutsSlice.caseReducers.weeksWorkoutsSet(state);
      workoutsSlice.caseReducers.todaysWorkoutsSet(state);

      // Reset stopwatch
      workoutsSlice.caseReducers.stopWatchStopped(state);
    },
    workoutCanceled: (state) => {
      state.selectedWorkout = workoutsSlice.getInitialState().selectedWorkout;
      state.selectedSet = workoutsSlice.getInitialState().selectedSet;

      // Reset stopwatch
      workoutsSlice.caseReducers.stopWatchStopped(state);
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
      const exercise = state.selectedWorkout?.exercises.find(
        (exercise) => exercise.id === exerciseId,
      );
      if (!exercise) return;

      if (weightChange && weightChange + exercise.weight >= 0) {
        exercise.weight += weightChange;
      } else if (newWeight !== undefined) {
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

      if (setIndex === 0) {
        if (exerciseIndex === 0) {
          state.selectedSet = null;
        } else {
          const previousExercise = exercises[exerciseIndex - 1];
          state.selectedSet = [exerciseIndex - 1, previousExercise.sets - 1];
        }
      } else {
        state.selectedSet = [exerciseIndex, setIndex - 1];
      }
    },
    onPressExerciseSet: (
      state,
      action: PayloadAction<{
        exerciseIndex: number;
        exerciseSetIndex: number;
      }>,
    ) => {
      if (!state.selectedWorkout) return;

      const { exerciseIndex, exerciseSetIndex } = action.payload;

      if (
        state.selectedSet &&
        exerciseIndex === state.selectedSet[0] &&
        exerciseSetIndex === -1
      ) {
        state.selectedSet = null;
      } else {
        if (exerciseSetIndex === -1) {
          state.selectedSet = [exerciseIndex, 0];
        } else {
          state.selectedSet = [exerciseIndex, exerciseSetIndex];
        }
      }
    },
    onEditSelectedWorkoutNotes: (state, action: PayloadAction<string>) => {
      if (!state.selectedWorkout) return;

      state.selectedWorkout.notes = action.payload;
    },

    stopWatchStarted: (state) => {
      state.stopWatchStartTime = Date.now();
    },
    stopWatchPaused: (state) => {
      // Calculate Extra Time
      const currentTime = Date.now();
      const startTime = state.stopWatchStartTime || currentTime;
      state.stopWatchExtraSeconds += Math.floor(
        (currentTime - startTime) / 1000,
      );

      state.stopWatchStartTime = null;
    },
    stopWatchStopped: (state) => {
      state.stopWatchStartTime = null;
      state.stopWatchExtraSeconds = 0;
    },
    bodyWeightRecordAdded: BodyWeightRecordAdapter.addOne,
  },
});

// Private Helper functions
const getNextWeight = (state: WorkoutsState, exerciseId: string) => {
  if (!state.exerciseRecords[exerciseId]) {
    return state.units === Units.IMPERIAL
      ? DEFAULT_WEIGHT_IMPERIAL
      : DEFAULT_WEIGHT_METRIC;
  }

  const exerciseIndex =
    state.exerciseRecords[exerciseId][
      state.exerciseRecords[exerciseId].length - 1
    ];

  return state.allRecords[exerciseIndex].weight;
};

const roundUnits = (weight: number, units: Units) => {
  const plates =
    units === Units.IMPERIAL ? DEFAULT_PLATES_IMPERIAL : DEFAULT_PLATES_METRIC;
  const smallestPlate = plates.sort()[0];
  return Math.round(weight / (smallestPlate * 2)) * (smallestPlate * 2);
};

const convertUnits = (weight: number, units: Units) => {
  return units === Units.IMPERIAL ? weight * 2.20462 : weight / 2.20462;
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
  onPressExerciseSet,
  workoutCanceled,
  stopWatchPaused,
  stopWatchStarted,
  appOpened,
  unitsSet,
  onEditSelectedWorkoutNotes,
  bodyWeightRecordAdded,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
