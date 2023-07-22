// Type definitions
interface ExerciseSet {
  id: number;
  reps: number;
  weight: number;
  restTime: number;
}

interface Exercise {
  name: string;
  sets: ExerciseSet[];
}

interface Workout {
  startDate: Date;
  repeatEvery: number; // in weeks
  exercises: Exercise[];
}

// Enums
enum Units {
  METRIC = 'METRIC',
  IMPERIAL = 'IMPERIAL',
}
