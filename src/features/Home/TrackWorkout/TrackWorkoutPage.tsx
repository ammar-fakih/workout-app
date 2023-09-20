import { FlatList } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { useAppSelector } from "../../../app/hooks";
import { selectSelectedWorkout } from "../workoutsSlice";
import { Exercise } from "../types";

export default function TrackWorkout() {
  const selectedWorkout = useAppSelector(selectSelectedWorkout);

  if (!selectedWorkout) return null;
  const renderItem = ({ item }: { item: Exercise }) => {
    
    return (
      <YStack>
        <XStack jc="center">
          <Text>{item.name}</Text>
          <Text>{item.</Text>
        </XStack>
      </YStack>
    );
  };

  return (
    <>
      <FlatList data={selectedWorkout.exercises} renderItem={renderItem} />
    </>
  );
}
