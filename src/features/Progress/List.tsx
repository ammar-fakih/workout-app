import { FlatList } from "react-native-gesture-handler";
import { View } from "tamagui";
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
      const aDate = allRecords[a.exercises[0]].date;
      const bDate = allRecords[b.exercises[0]].date;
      return aDate > bDate ? 1 : -1;
    });
    setSortedWorkoutRecords(sortedWorkoutRecords);
  };

  const onPressDateDesc = () => {
    if (!workoutRecords?.length) return;

    const sortedWorkoutRecords = [...workoutRecords];
    sortedWorkoutRecords.sort((a, b) => {
      const aDate = allRecords[a.exercises[0]].date;
      const bDate = allRecords[b.exercises[0]].date;
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
    const exercises = getWorkoutExercises(item.exercises, allRecords);
    return (
      <WorkoutCard
        key={index}
        onPressWorkout={() => {}}
        date={exercises[0].date}
        exercises={exercises as TodaysExercise[]}
        name={item.name}
      />
    );
  };

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
