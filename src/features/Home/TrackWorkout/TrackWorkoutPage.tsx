import { ChevronDown } from "@tamagui/lucide-icons";
import { isEqual } from "lodash";
import { useRef, useState } from "react";
import { FlatList, Keyboard } from "react-native";
import {
  Accordion,
  Button,
  Input,
  Square,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getUnitAbbreviation } from "../helperFunctions";
import { TodaysExercise } from "../types";
import {
  exerciseSetClicked,
  exerciseWeightChanged,
  selectSelectedWorkout,
  workoutFinished,
} from "../workoutsSlice";

export default function TrackWorkout() {
  const [selectedSet, setSelectedSet] = useState<[number, number] | null>([
    0, 0,
  ]);
  const selectedWorkout = useAppSelector(selectSelectedWorkout);
  const units = useAppSelector((state) => state.appData.workouts.units);
  const accordionRef = useRef(null);
  const dispatch = useAppDispatch();

  const onPressNextSet = (exerciseIndex: number, setIndex: number) => {
    if (!selectedWorkout) return;
    if (
      setIndex ===
      selectedWorkout.exercises[exerciseIndex].completedSets.length - 1
    ) {
      if (exerciseIndex === selectedWorkout.exercises.length - 1) {
        setSelectedSet(null);
      } else {
        setSelectedSet([exerciseIndex + 1, 0]);
      }
    } else {
      setSelectedSet([exerciseIndex, setIndex + 1]);
    }
  };

  const onPressPreviousSet = (exerciseIndex: number, setIndex: number) => {
    if (!selectedWorkout) return;
    if (setIndex === 0) {
      setSelectedSet([
        exerciseIndex - 1,
        selectedWorkout.exercises[exerciseIndex - 1].completedSets.length - 1,
      ]);
    } else {
      setSelectedSet([exerciseIndex, setIndex - 1]);
    }
  };

  if (!selectedWorkout) return null;

  const renderItem = ({
    item: exercise,
    index,
  }: {
    item: TodaysExercise;
    index: number;
  }) => {
    return (
      <YStack>
        <View
          justifyContent="space-between"
          alignItems="center"
          borderWidth="$0"
          pb="$0"
        >
          <Text>{exercise.name}</Text>

          <XStack>
            <Button variant="outlined">
              <Text>{`${exercise.sets}x${exercise.reps}`}</Text>
            </Button>
            <Square
              animation="quick"
              rotate={index === selectedSet?.[0] ? "180deg" : "0deg"}
            >
              <ChevronDown size="$1" />
            </Square>
          </XStack>
        </View>

        <YStack space="$6">
          <FlatList
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
                  {isItemSelected &&
                    !(index === 0 && exerciseSetIndex === 0) && (
                      <Button
                        onPress={() => {
                          onPressPreviousSet(index, exerciseSetIndex);
                        }}
                      >
                        <Text>Prev</Text>
                      </Button>
                    )}
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
                    <Text fontSize="$8" letterSpacing="$3">
                      {set.repCount}
                    </Text>
                  </Button>
                  {isItemSelected && ! && (
                    <Button
                      onPress={() => {
                        onPressNextSet(index, exerciseSetIndex);
                      }}
                    >
                      <Text>Next</Text>
                    </Button>
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
      </YStack>
    );
  };

  return (
    <View bg="$background" flex={1} onPress={Keyboard.dismiss}>
      <Accordion type="single" defaultValue="0" ref={accordionRef}>
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
