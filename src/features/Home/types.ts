export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
}

export interface CompletedSet {
  repCount: number;
  selected: boolean;
  weight?: number;
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
  frequency: number; // in days
}

export interface Workout extends GeneralWorkout, SpecificWorkout {
  closestTimeToNow: string;
}

export interface TodaysWorkout extends Workout {
  completed: boolean;
  exercises: TodaysExercise[];
}

export interface SelectedWorkout extends Workout {
  exercises: SelectedExercise[];
  notes: string;
}

export interface ProgramFromFile {
  id: string;
  name: string;
  workouts: SpecificWorkout[];
}

export interface Program {
  lucidIcon?: string;
  id: string;
  name: string;
  workouts: Workout[];
}

export interface ExerciseRecord extends TodaysExercise {
  date: string;
  programId?: string; // Optional because you can add an exercise without a program
  programName?: string; // Optional because you can add an exercise without a program
}

export interface WorkoutRecord {
  exercises: number[]; // maps to indices in allRecords
  name: string;
  timeToComplete: number; // in seconds
  notes: string;
  programId?: string; // Optional because you can add a workout without a program
  programName?: string; // Optional because you can add a workout without a program
}

// For rendering the workout records table
export interface WorkoutRecordData {
  exercises: ExerciseRecord[];
  name: string;
}

export interface BodyWeightRecord {
  date: string;
  weight: number;
}

// Enums
export enum Units {
  METRIC = "METRIC",
  IMPERIAL = "IMPERIAL",
}
