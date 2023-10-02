export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
}

export interface CompletedSet {
  repCount: number;
  selected: boolean;
}

export interface TodaysExercise extends Exercise {
  completedSets: CompletedSet[];
  weight: number;
}

export interface SelectedExercise extends TodaysExercise {
  startingWeight: number;
}

export interface GeneralWorkout {
  id: string;
  name: string;
  exercises: Exercise[];
  icon?: string;
}

export interface SpecificWorkout {
  id: string;
  workoutId: string;
  startDate: string;
  frequency: number; // in weeks
}

export interface Workout extends GeneralWorkout, SpecificWorkout {
  closestTimeToNow: string;
}

export interface TodaysWorkout extends Workout {
  exercises: TodaysExercise[];
}

export interface SelectedWorkout extends Workout {
  exercises: SelectedExercise[];
}

export interface ProgramFromFile {
  id: string;
  name: string;
  workouts: SpecificWorkout[];
}

export interface Program {
  id: string;
  name: string;
  workouts: Workout[];
}

export interface ExerciseRecord extends TodaysExercise {
  date: string;
}

export interface WorkoutRecord {
  exercises: number[]; // maps to indices in allRecords
  name: string;
}

export interface WorkoutRecordData {
  exercises: ExerciseRecord[];
  name: string;
}

// Enums
export enum Units {
  METRIC = "METRIC",
  IMPERIAL = "IMPERIAL",
}
