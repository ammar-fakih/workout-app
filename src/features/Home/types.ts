export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
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
