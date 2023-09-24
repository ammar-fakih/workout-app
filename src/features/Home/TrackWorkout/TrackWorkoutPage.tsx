import { ArrowRight, Plus } from "@tamagui/lucide-icons";
import { FlatList } from "react-native";
import { Button, Text, View, XStack, YStack } from "tamagui";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { renderExerciseLabel } from "../helperFunctions";
import { TodaysExercise } from "../types";
import {
  exerciseSetClicked,
  selectSelectedWorkout,
  workoutFinished,
} from "../workoutsSlice";

export default function TrackWorkout() {
  const selectedWorkout = useAppSelector(selectSelectedWorkout);
  const units = useAppSelector((state) => state.appData.workouts.units);
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
            <Text>{renderExerciseLabel(exercise, units)}</Text>
          </Button>
        </XStack>

        <FlatList
          horizontal
          data={exercise.completedSets}
          renderItem={({ item: set, index: exerciseSetIndex }) => (
            <Button
              backgroundColor={set.selected ? "$color7" : "$color1"}
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
              <Text fontSize="$5" letterSpacing="$3">
                {set.repCount}
              </Text>
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
      <Button
        onPress={() => {
          dispatch(workoutFinished());
        }}
      >
        Finish
      </Button>
    </View>
  );
}
