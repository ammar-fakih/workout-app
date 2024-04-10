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
}

export interface WorkoutRecord {
  exercises: number[]; // maps to indices in allRecords
  name: string;
  timeToComplete: number; // in seconds
  notes: string;
}

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
