// Type definitions
interface ExerciseSet {
  id: number;
  reps: number;
  restTime: number; // in seconds
}

interface Exercise {
  name: string;
  sets: ExerciseSet[];
  icon?: string;
}

export interface Workout {
  name?: string;
  startDate: string;
  frequency: number; // in weeks or days
  exercises: Exercise[];
  icon?: string;
}

// Enums
export enum Units {
  METRIC = "METRIC",
  IMPERIAL = "IMPERIAL",
}
