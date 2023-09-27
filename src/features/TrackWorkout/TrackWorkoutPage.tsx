import { isEqual } from "lodash";
import { FlatList, Keyboard, LayoutAnimation } from "react-native";
import { Accordion, Button, Input, Text, View, XStack, YStack } from "tamagui";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUnitAbbreviation } from "../Home/helperFunctions";
import { TodaysExercise } from "../Home/types";
import {
  exerciseSetClicked,
  exerciseWeightChanged,
  onPressExerciseSet,
  onPressNextSet,
  onPressPreviousSet,
  selectSelectedWorkout,
  workoutFinished,
} from "../Home/workoutsSlice";

export default function TrackWorkout() {
  const selectedSet = useAppSelector(
    (state) => state.appData.workouts.selectedSet,
  );
  const selectedWorkout = useAppSelector(selectSelectedWorkout);
  const units = useAppSelector((state) => state.appData.workouts.units);
  const dispatch = useAppDispatch();

  const handlePressNextSet = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(onPressNextSet());
  };

  const handlePressPreviousSet = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(onPressPreviousSet());
  };

  const handlePressExerciseHeader = (
    exerciseIndex: number,
    exerciseSetIndex: number,
  ) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(onPressExerciseSet({ exerciseIndex, exerciseSetIndex }));
  };

  if (!selectedWorkout) return null;

  const renderItem = ({
    item: exercise,
    index,
  }: {
    item: TodaysExercise;
    index: number;
  }) => {
    const isExerciseSelected = index === selectedSet?.[0];
    return (
      <YStack
        key={exercise.id}
        bg={isExerciseSelected ? "$background" : "$backgroundStrong"}
      >
        {/* Header */}
        <XStack
          jc="space-between"
          marginHorizontal="$5"
          marginVertical={isExerciseSelected ? "$4" : "$1"}
          alignItems="center"
          borderWidth="$0"
          pb="$0"
          onPress={() => handlePressExerciseHeader(index, 0)}
        >
          <Text>{exercise.name}</Text>

          <XStack>
            <Button variant="outlined">
              <Text>{`${exercise.sets}x${exercise.reps}`}</Text>
            </Button>
          </XStack>
        </XStack>

        {/* Body */}
        {isExerciseSelected && (
          <YStack space="$6" pb="$4">
            <FlatList
              scrollEnabled={false}
              data={exercise.completedSets}
              renderItem={({ item: set, index: exerciseSetIndex }) => {
                const isItemSelected = isEqual(selectedSet, [
                  index,
                  exerciseSetIndex,
                ]);
                return (
                  <XStack
                    jc="space-around"
                    p="$3"
                    bg={isItemSelected ? "$backgroundHover" : undefined}
                    onPress={() =>
                      handlePressExerciseHeader(index, exerciseSetIndex)
                    }
                  >
                    {isItemSelected ? (
                      <Button onPress={handlePressPreviousSet}>
                        <Text>Prev</Text>
                      </Button>
                    ) : (
                      <View />
                    )}
                    <Button
                      disabled={!isItemSelected}
                      bg={set.selected ? "$color7" : "$color1"}
                      borderRadius="$radius.12"
                      onPress={() => {
                        dispatch(
                          exerciseSetClicked({
                            exerciseIndex: index,
                            exerciseSetIndex,
                          }),
                        );
                      }}
                    >
                      <Text
                        fontSize="$8"
                        letterSpacing="$3"
                        color={isItemSelected ? "$color" : "$color6"}
                      >
                        {set.repCount}
                      </Text>
                    </Button>
                    {isItemSelected &&
                    !(index === selectedWorkout.exercises.length) ? (
                      <Button onPress={handlePressNextSet}>
                        <Text>Next</Text>
                      </Button>
                    ) : (
                      <View />
                    )}
                  </XStack>
                );
              }}
            />
            <XStack space="$4" jc="center">
              <Button
                onPress={() => {
                  dispatch(
                    exerciseWeightChanged({
                      exerciseId: exercise.id,
                      weightChange: -5,
                    }),
                  );
                }}
              >
                <Text>-5</Text>
              </Button>
              <Input
                keyboardType="numeric"
                placeholder={`${exercise.weight.toString()} ${getUnitAbbreviation(
                  units,
                )}`}
              />
              <Button
                onPress={() => {
                  dispatch(
                    exerciseWeightChanged({
                      exerciseId: exercise.id,
                      weightChange: 5,
                    }),
                  );
                }}
              >
                <Text>+5</Text>
              </Button>
            </XStack>
          </YStack>
        )}
      </YStack>
    );
  };

  return (
    <View bg="$backgroundStrong" flex={1} onPress={Keyboard.dismiss}>
      <Accordion type="single" defaultValue="0">
        {selectedWorkout.exercises.map((exercise, index) => {
          return renderItem({ item: exercise, index });
        })}
      </Accordion>
      {/* <FlatList data={selectedWorkout.exercises} renderItem={renderItem} /> */}
      <Button
        pos="absolute"
        b="$4"
        r="$4"
        l="$4"
        onPress={() => {
          dispatch(workoutFinished());
        }}
      >
        Finish
      </Button>
    </View>
  );
}
