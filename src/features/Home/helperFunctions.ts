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

export const getDefaultWeight = (units: Units) => {
  return units === Units.IMPERIAL ? 45 : 20;
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
  return `${exercise.sets}x${exercise.reps} ${
    exercise.weight
  }${getUnitAbbreviation(units)}`;
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
  // console.log(new Date(closestTimeToNow));
  // console.log(newNumIntervals * interval);

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
  return workout.map((exericseId) => allRecords[exericseId]);
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
