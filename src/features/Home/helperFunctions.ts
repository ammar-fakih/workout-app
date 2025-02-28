import { ExerciseRecord, TodaysExercise, Units } from "./types";

export const getDayName = (date: Date) => {
  const dayNum = date.getDay();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayNum];
};

export const getFullDayName = () => {
  const today = new Date();
  const dayNum = today.getDay();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[dayNum];
};

export const getUnitAbbreviation = (units: Units) => {
  return units === Units.IMPERIAL ? "lb" : "kg";
};

export const getCurrentWeekRangeTime = () => {
  const today = new Date();
  const dayNum = today.getDay();
  const sunday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - dayNum,
  );
  const saturday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + (6 - dayNum),
  );
  return { sunday, saturday };
};

export const renderExerciseLabel = (exercise: TodaysExercise, units: Units) => {
  if (!exercise) return "";

  // Format weights with slashes if they differ
  const weightDisplay = formatWeights(exercise.completedSets, exercise.weight);
  return `${exercise.sets}x${
    exercise.reps
  } ${weightDisplay}${getUnitAbbreviation(units)}`;
};

export const getClosestDate = (
  startDate: string,
  frequency: number,
  numIntervals?: number,
): { closestTimeToNow: Date; newNumIntervals: number } => {
  const workoutStartTime = new Date(startDate).getTime();
  const currentTime = new Date().getTime();
  const interval = 1000 * 60 * 60 * 24 * 7 * frequency;

  const diff = currentTime - workoutStartTime;
  const newNumIntervals = numIntervals
    ? numIntervals
    : Math.floor(diff / interval);

  // round to nearest interval
  const closestTimeToNow = newNumIntervals * interval + workoutStartTime;
  return { closestTimeToNow: new Date(closestTimeToNow), newNumIntervals };
};

export const getOrdinalNumber = (i: number) => {
  const j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
};

export const getDateString = (date: string) => {
  const d = new Date(date);
  return `${getDayName(d)}, ${d.getDate()} ${d.toLocaleString("default", {
    month: "short",
  })}`;
};

export const getWorkoutExercises = (
  workout: number[],
  allRecords: ExerciseRecord[],
) => {
  if (!workout || !allRecords) return [];

  return workout
    .map((exerciseId) => {
      if (exerciseId >= 0 && exerciseId < allRecords.length) {
        return allRecords[exerciseId];
      }
      return null;
    })
    .filter(Boolean);
};

export const calculateStopWatchValue = (
  startTime: number | null,
  extraTime: number,
) => {
  const currentTime = Date.now();
  const diff = startTime ? currentTime - startTime : 0;
  const seconds = Math.floor(diff / 1000) + extraTime;
  return seconds;
};

export const getStopWatchStringFromSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const shortenString = (str: string, maxLength: number) => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
};

// Add a function to format weights with slashes when they differ
export const formatWeights = (
  completedSets: { weight?: number }[] | null | undefined,
  defaultWeight: number | null | undefined,
): string => {
  // If no completed sets or default weight is undefined, return '0'
  if (
    !completedSets ||
    completedSets.length === 0 ||
    defaultWeight === undefined ||
    defaultWeight === null
  ) {
    return defaultWeight !== undefined && defaultWeight !== null
      ? defaultWeight.toString()
      : "0";
  }

  // Get all weights, using default weight if not specified
  const weights = completedSets.map((set) =>
    set && set.weight !== undefined ? set.weight : defaultWeight,
  );

  // Check if all weights are the same
  const allSame = weights.every((weight) => weight === weights[0]);

  // If all weights are the same, return the first one
  if (allSame && weights[0] !== null && weights[0] !== undefined) {
    return weights[0].toString();
  }

  // Otherwise, return weights with slashes, ensuring no null values
  return weights
    .map((w) => (w !== null && w !== undefined ? w.toString() : "0"))
    .join("/");
};

// Add a function to get the average weight
export const getAverageWeight = (
  completedSets: { weight?: number }[],
  defaultWeight: number,
): number => {
  if (
    !completedSets ||
    completedSets.length === 0 ||
    defaultWeight === undefined
  ) {
    return defaultWeight !== undefined ? defaultWeight : 0;
  }

  const weights = completedSets.map((set) =>
    set && set.weight !== undefined ? set.weight : defaultWeight,
  );
  const sum = weights.reduce((acc, weight) => acc + weight, 0);
  return sum / weights.length;
};
