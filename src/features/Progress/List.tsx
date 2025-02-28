import { FlatList } from "react-native-gesture-handler";
import { H4, View, YStack, Text } from "tamagui";
import SortByMenu from "../../Components/SortByMenu";
import WorkoutCard from "../../Components/WorkoutCard";
import { useAppSelector } from "../../app/hooks";
import { getWorkoutExercises } from "../Home/helperFunctions";
import { TodaysExercise, WorkoutRecord } from "../Home/types";
import { useEffect, useState } from "react";

export default function List() {
  const workoutRecords = useAppSelector(
    (state) => state.appData.workouts.workoutRecords,
  );
  const allRecords = useAppSelector(
    (state) => state.appData.workouts.allRecords,
  );
  const [sortedWorkoutRecords, setSortedWorkoutRecords] = useState<
    WorkoutRecord[]
  >([]);

  useEffect(() => {
    setSortedWorkoutRecords(workoutRecords);
  }, [workoutRecords]);

  const onPressDateAsc = () => {
    if (!workoutRecords?.length) return;

    const sortedWorkoutRecords = [...workoutRecords];
    sortedWorkoutRecords.sort((a, b) => {
      const aDate =
        a.exercises[0] !== undefined && allRecords[a.exercises[0]]?.date;
      const bDate =
        b.exercises[0] !== undefined && allRecords[b.exercises[0]]?.date;
      return aDate > bDate ? 1 : -1;
    });
    setSortedWorkoutRecords(sortedWorkoutRecords);
  };

  const onPressDateDesc = () => {
    if (!workoutRecords?.length) return;

    const sortedWorkoutRecords = [...workoutRecords];
    sortedWorkoutRecords.sort((a, b) => {
      const aDate =
        a.exercises[0] !== undefined && allRecords[a.exercises[0]]?.date;
      const bDate =
        b.exercises[0] !== undefined && allRecords[b.exercises[0]]?.date;
      return aDate < bDate ? 1 : -1;
    });
    setSortedWorkoutRecords(sortedWorkoutRecords);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: WorkoutRecord;
    index: number;
  }) => {
    const exercises = getWorkoutExercises(item.exercises || [], allRecords || []);
    return (
      <WorkoutCard
        key={index}
        onPressWorkout={() => {}}
        date={exercises && exercises[0]?.date || new Date().toISOString()}
        exercises={exercises as TodaysExercise[]}
        name={item.name || "Unnamed Workout"}
      />
    );
  };

  if (!sortedWorkoutRecords.length) {
    return (
      <YStack f={1} ai="center" jc="center" space="$4">
        <H4>No Exercise Data Available</H4>
        <Text>Complete workouts to see your progress</Text>
      </YStack>
    );
  }

  return (
    <View f={1}>
      <View ai="flex-start">
        <SortByMenu
          onPressDateAsc={onPressDateAsc}
          onPressDateDesc={onPressDateDesc}
        />
      </View>
      <FlatList data={sortedWorkoutRecords} renderItem={renderItem} />
    </View>
  );
}
