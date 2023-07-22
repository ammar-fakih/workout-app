interface ExerciseSet {
  reps: number;
  weight: number;
  restTime: number;
}

interface Exercise {
  name: string;
  sets: ExerciseSet[];
}

interface Workout {
  name?: string;
  exercises: Exercise[];
}

enum Units {
  METRIC = 'METRIC',
  IMPERIAL = 'IMPERIAL',
}
