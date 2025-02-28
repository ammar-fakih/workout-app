import { useState, useMemo } from "react";
import { FlatList, Alert } from "react-native";
import { ScrollView, View, XStack, YStack, Text, Button, Input } from "tamagui";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { BodyWeightRecord, Units } from "../Home/types";
import {
  selectAllBodyWeightRecords,
  todayBodyWeightRecordAdded,
} from "../Home/workoutsSlice";
import { HeaderCell, TableCell } from "./Table";
import { getUnitAbbreviation } from "../Home/helperFunctions";

// Helper function to format date as MM/DD
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// Helper function to get today's date in ISO format (YYYY-MM-DD)
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Helper function to get the week number of a date
const getWeekNumber = (dateString: string) => {
  const date = new Date(dateString);
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Helper function to group records by week
const groupRecordsByWeek = (records: BodyWeightRecord[]) => {
  const weeks = new Map<number, BodyWeightRecord[]>();

  records.forEach((record) => {
    const weekNumber = getWeekNumber(record.date);
    if (!weeks.has(weekNumber)) {
      weeks.set(weekNumber, []);
    }
    weeks.get(weekNumber)?.push(record);
  });

  // Sort weeks by date (most recent first)
  return Array.from(weeks.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([weekNumber, weekRecords]) => {
      // Calculate week average
      const sum = weekRecords.reduce((acc, record) => acc + record.weight, 0);
      const average = weekRecords.length > 0 ? sum / weekRecords.length : 0;

      // Create a record for each day of the week
      const days = Array(7).fill(null);
      weekRecords.forEach((record) => {
        const date = new Date(record.date);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
        days[dayOfWeek] = record;
      });

      return {
        weekNumber,
        average: average.toFixed(1),
        days,
        startDate:
          weekRecords.length > 0
            ? new Date(
                Math.min(...weekRecords.map((r) => new Date(r.date).getTime())),
              )
            : new Date(),
      };
    });
};

// Define an interface for the weekly record
interface WeeklyRecord {
  weekNumber: number;
  average: string;
  days: (BodyWeightRecord | null)[];
  startDate: Date;
}

export default function BodyWeight() {
  const dispatch = useAppDispatch();
  const records = useAppSelector((state) => selectAllBodyWeightRecords(state));
  const units = useAppSelector((state) => state.appData.workouts.units);

  const [weight, setWeight] = useState("");
  const [isAddingRecord, setIsAddingRecord] = useState(false);

  const headers = useMemo(
    () => [
      "Date",
      `Week Avg (${getUnitAbbreviation(units)})`,
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ],
    [units],
  );

  const weeklyRecords = useMemo(() => groupRecordsByWeek(records), [records]);

  const handleAddRecord = () => {
    if (!weight || isNaN(Number(weight))) {
      Alert.alert("Invalid Weight", "Please enter a valid weight value.");
      return;
    }

    const today = getTodayDateString();
    const existingRecord = records.find((r) => r.date.startsWith(today));

    if (existingRecord) {
      Alert.alert(
        "Record Exists",
        "You already have a body weight record for today. Do you want to replace it?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Replace",
            onPress: () => {
              dispatch(
                todayBodyWeightRecordAdded({
                  date: today,
                  weight: Number(weight),
                }),
              );
              setWeight("");
              setIsAddingRecord(false);
            },
          },
        ],
      );
    } else {
      dispatch(
        todayBodyWeightRecordAdded({
          date: today,
          weight: Number(weight),
        }),
      );
      setWeight("");
      setIsAddingRecord(false);
    }
  };

  const renderRow = ({
    item,
    index,
  }: {
    item: WeeklyRecord;
    index: number;
  }) => {
    const { weekNumber, average, days, startDate } = item;
    const dateLabel = `Week ${weekNumber} (${formatDate(
      startDate.toISOString(),
    )})`;

    return (
      <XStack f={1} key={index}>
        <TableCell item={dateLabel} index={0} renderTopBorder={true} />
        <TableCell item={`${average}`} index={1} renderTopBorder={true} />
        {days.map((day: BodyWeightRecord | null, dayIndex: number) => (
          <TableCell
            key={dayIndex + 2}
            item={day ? day.weight.toString() : "-"}
            index={dayIndex + 2}
            renderTopBorder={true}
          />
        ))}
      </XStack>
    );
  };

  return (
    <View f={1}>
      <YStack space="$2" p="$2">
        {isAddingRecord ? (
          <XStack space="$2" ai="center">
            <Input
              flex={1}
              placeholder={`Enter weight (${getUnitAbbreviation(units)})`}
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <Button onPress={handleAddRecord}>Save</Button>
            <Button variant="outlined" onPress={() => setIsAddingRecord(false)}>
              Cancel
            </Button>
          </XStack>
        ) : (
          <Button onPress={() => setIsAddingRecord(true)}>
            {records.find((r) => r.date.startsWith(getTodayDateString()))
              ? "Edit Today's Weight"
              : "Add Today's Weight"}
          </Button>
        )}
      </YStack>

      {!records.length ? (
        <YStack ai="center" space="$2" m="$3">
          <Text fontWeight="$8" fontSize="$5">
            No Body Weight Records Yet
          </Text>
          <Text>Add body weight records to see them here</Text>
        </YStack>
      ) : (
        <ScrollView horizontal>
          <YStack>
            <XStack>
              {headers.map((item, index) => (
                <HeaderCell item={item} index={index} key={index} />
              ))}
            </XStack>

            <FlatList
              data={weeklyRecords}
              renderItem={renderRow}
              keyExtractor={(item: WeeklyRecord) => `week-${item.weekNumber}`}
            />
          </YStack>
        </ScrollView>
      )}
    </View>
  );
}
