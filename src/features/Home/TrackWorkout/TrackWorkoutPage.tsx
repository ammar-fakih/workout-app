import { Text, XStack, YStack } from "tamagui";
import { useAppSelector } from "../../../app/hooks";
import { Exercise } from "../types";
import { selectSelectedWorkout } from "../workoutsSlice";

export default function TrackWorkout() {
  const selectedWorkout = useAppSelector(selectSelectedWorkout);

  if (!selectedWorkout) return null;
  const renderItem = ({ item }: { item: Exercise }) => {
    return (
      <YStack>
        <XStack jc="center">
          <Text>{item.name}</Text>
          <Text />
        </XStack>
      </YStack>
    );
  };

  return <></>;
}
