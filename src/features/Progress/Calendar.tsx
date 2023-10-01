import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { CalendarUtils, Calendar as RNC } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { View, useTheme } from "tamagui";
import { useAppSelector } from "../../app/hooks";

export default function Calendar() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const allRecords = useAppSelector(
    (state) => state.appData.workouts.allRecords,
  );

  const markedDates = useMemo(() => {
    return allRecords.reduce((acc, record) => {
      const date = new Date(record.date);
      const dateString = CalendarUtils.getCalendarDateString(date);
      acc[dateString] = {
        marked: true,
        dotColor: theme.color8.val,
      };
      return acc;
    }, {} as MarkedDates);
  }, [allRecords]);

  return (
    <View m="$2">
      <RNC
        key={colorScheme}
        style={{
          borderRadius: 10,
          borderWidth: 2,
          borderColor: theme.borderColor.val,
        }}
        theme={{
          calendarBackground: theme.background.val,
          dayTextColor: theme.color.val,
          todayTextColor: theme.colorFocus.val,
          selectedDayTextColor: theme.color.val,
          monthTextColor: theme.color.val,
          indicatorColor: theme.color1.val,
          selectedDayBackgroundColor: theme.color6.val,
          arrowColor: theme.color.val,
          textDisabledColor: theme.background.val,
        }}
        markedDates={markedDates}
      />
    </View>
  );
}
