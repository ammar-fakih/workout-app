export const getDayName = (date: Date) => {
  const dayNum = date.getDay();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayNum];
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
  console.log(new Date(closestTimeToNow));
  console.log(newNumIntervals * interval);

  return { closestTimeToNow: new Date(closestTimeToNow), newNumIntervals };
};
