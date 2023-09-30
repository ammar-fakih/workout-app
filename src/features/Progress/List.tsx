import { FlatList } from "react-native-gesture-handler";
import { YStack } from "tamagui";
import WorkoutCard from "../../Components/WorkoutCard";
import { useAppSelector } from "../../app/hooks";
import { getWorkoutExercises } from "../Home/helperFunctions";
import { TodaysExercise, WorkoutRecord } from "../Home/types";

export default function List() {
  const workoutRecords = useAppSelector(
    (state) => state.appData.workouts.workoutRecords,
  );
  const allRecords = useAppSelector(
    (state) => state.appData.workouts.allRecords,
  );

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
    <YStack f={1}>
      <FlatList data={workoutRecords} renderItem={renderItem} />
    </YStack>
  );
}
