import { FlatList } from "react-native-gesture-handler";
import { YStack } from "tamagui";
import WorkoutCard from "../../Components/WorkoutCard";
import { useAppSelector } from "../../app/hooks";
import { getWorkoutExercises } from "../Home/helperFunctions";
import { TodaysWorkout } from "../Home/types";

export default function List() {
  const workoutRecords = useAppSelector(
    (state) => state.appData.workouts.workoutRecords,
  );
  const allRecords = useAppSelector(
    (state) => state.appData.workouts.allRecords,
  );

  const renderItem = ({ item, index }: { item: number[]; index: number }) => {
    const exercises = getWorkoutExercises(item, allRecords);
    const workout: TodaysWorkout = {
      closestTimeToNow: exercises[0].date,
      exercises,
      id: index.toString(),
      frequency: 0,
      name: "",
      startDate: exercises[0].date,
      workoutId: exercises[0].workoutId,
    };
    return <WorkoutCard onPressWorkout={() => {}} workout={item} />;
  };

  return (
    <YStack f={1}>
      <FlatList data={workoutRecords} renderItem={renderItem} />
    </YStack>
  );
}
