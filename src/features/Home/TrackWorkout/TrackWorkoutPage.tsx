import { FlatList } from "react-native";
import { Button, Text, View, XStack, YStack } from "tamagui";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { TodaysExercise } from "../types";
import { exerciseSetClicked, selectSelectedWorkout } from "../workoutsSlice";
import { ArrowRight, Plus } from "@tamagui/lucide-icons";

export default function TrackWorkout() {
  const selectedWorkout = useAppSelector(selectSelectedWorkout);
  const dispatch = useAppDispatch();

  if (!selectedWorkout) return null;

  const renderItem = ({
    item: exercise,
    index,
  }: {
    item: TodaysExercise;
    index: number;
  }) => {
    return (
      <YStack p="$4">
        <XStack jc="space-between" ai="center">
          <Text>{exercise.name}</Text>
          <Button variant="outlined" iconAfter={<ArrowRight />} pr="$0">
            <Text>
              {exercise.sets}x{exercise.reps}
            </Text>
          </Button>
        </XStack>

        <FlatList
          horizontal
          data={exercise.completedSets}
          renderItem={({ item: set, index: exerciseSetIndex }) => (
            <Button
              backgroundColor={set.selected ? "$color8" : "$color1"}
              borderRadius="$10"
              marginHorizontal="$3"
              onPress={() => {
                dispatch(
                  exerciseSetClicked({
                    exerciseIndex: index,
                    exerciseSetIndex,
                  }),
                );
              }}
            >
              <Text fontSize="$5">{set.setCount}</Text>
            </Button>
          )}
          ListFooterComponent={() => (
            <Button borderRadius="$10" marginHorizontal="$3" icon={<Plus />} />
          )}
        />
      </YStack>
    );
  };

  return (
    <View bg="$background" flex={1}>
      <FlatList data={selectedWorkout.exercises} renderItem={renderItem} />
    </View>
  );
}
