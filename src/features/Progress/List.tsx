import { FlatList } from "react-native-gesture-handler";
import { YStack } from "tamagui";
import WorkoutCard from "../../Components/WorkoutCard";
import { useAppSelector } from "../../app/hooks";
import { getWorkoutExercises } from "../Home/helperFunctions";
import { RecordEntry, TodaysExercise, TodaysWorkout } from "../Home/types";

export default function List() {
  const workoutRecords = useAppSelector(
    (state) => state.appData.workouts.workoutRecords,
  );
  const allRecords = useAppSelector(
    (state) => state.appData.workouts.allRecords,
  );

  const renderItem = ({ item, index }: { item: number[]; index: number }) => {
    const exercises = getWorkoutExercises(item, allRecords);
    return (
      <WorkoutCard
        key={index}
        onPressWorkout={() => {}}
        date={exercises[0].date}
        exercises={exercises as TodaysExercise[]}
        name=""
      />
    );
  };

  return (
    <YStack f={1}>
      <FlatList data={workoutRecords} renderItem={renderItem} />
    </YStack>
  );
}
