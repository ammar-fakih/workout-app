import { isEqual } from "lodash";
import { FlatList, Keyboard, LayoutAnimation } from "react-native";
import { Accordion, Button, Input, Text, View, XStack, YStack } from "tamagui";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getUnitAbbreviation } from "../helperFunctions";
import { TodaysExercise } from "../types";
import {
  exerciseSetClicked,
  exerciseWeightChanged,
  onPressExercise,
  onPressNextSet,
  onPressPreviousSet,
  selectSelectedWorkout,
  workoutFinished,
} from "../workoutsSlice";

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

  const handlePressExerciseHeader = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(onPressExercise(index));
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
        backgroundColor={
          isExerciseSelected ? "$background" : "$backgroundStrong"
        }
      >
        {/* Header */}
        <XStack
          justifyContent="space-between"
          marginHorizontal="$5"
          marginVertical={isExerciseSelected ? "$4" : "$1"}
          alignItems="center"
          borderWidth="$0"
          pb="$0"
          onPress={() => handlePressExerciseHeader(index)}
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
                    borderRadius="$radius.4"
                    backgroundColor={
                      isItemSelected ? "$backgroundHover" : undefined
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
                      backgroundColor={set.selected ? "$color7" : "$color1"}
                      borderRadius="$10"
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
                    !(
                      index === selectedWorkout.exercises.length &&
                      exerciseSetIndex ===
                        selectedWorkout.exercises[index].completedSets.length
                    ) ? (
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
