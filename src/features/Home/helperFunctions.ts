// Calculates the next weekday of the given start date with frequency
// Ex: Frequency 2 means every other week
export const calculateNextDay = (startDate: Date, frequency: number) => {
  const today = new Date();
  const dayDiff = Math.round(
    (today.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
  );
  const remainder = dayDiff % frequency;
  const nextDay = new Date(
    today.getTime() + (frequency - remainder) * 1000 * 3600 * 24,
  );
  return nextDay;
};

export const getDayName = (date: Date) => {
  const dayNum = date.getDay();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayNum];
};
