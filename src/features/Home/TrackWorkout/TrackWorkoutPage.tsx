import { ChevronDown, Plus } from "@tamagui/lucide-icons";
import { FlatList } from "react-native";
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
import { getUnitAbbreviation, renderExerciseLabel } from "../helperFunctions";
import { TodaysExercise } from "../types";
import {
  exerciseSetClicked,
  exerciseWeightChanged,
  selectSelectedWorkout,
  workoutFinished,
} from "../workoutsSlice";
import { useRef } from "react";

export default function TrackWorkout() {
  const selectedWorkout = useAppSelector(selectSelectedWorkout);
  const units = useAppSelector((state) => state.appData.workouts.units);
  const accordionRef = useRef(null);
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
      <Accordion.Item value={index.toString()} key={exercise.id}>
        <Accordion.Trigger
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          borderWidth="$0"
          pb="$0"
        >
          {({ open }: { open: boolean }) => (
            <>
              <Text>{exercise.name}</Text>

              <XStack>
                <Button variant="outlined">
                  <Text>{`${exercise.sets}x${exercise.reps}`}</Text>
                </Button>
                <Square animation="quick" rotate={open ? "180deg" : "0deg"}>
                  <ChevronDown size="$1" />
                </Square>
              </XStack>
            </>
          )}
        </Accordion.Trigger>

        <Accordion.Content>
          <YStack space="$4">
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
                <Button
                  borderRadius="$10"
                  marginHorizontal="$3"
                  icon={<Plus />}
                />
              )}
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
        </Accordion.Content>
      </Accordion.Item>
    );
  };

  return (
    <View bg="$background" flex={1}>
      <Accordion type="single" defaultValue="0" ref={accordionRef}>
        {selectedWorkout.exercises.map((exercise, index) => {
          return renderItem({ item: exercise, index });
        })}
      </Accordion>
      {/* <FlatList data={selectedWorkout.exercises} renderItem={renderItem} /> */}
      <Button
        pos="absolute"
        b="$2"
        r="$2"
        l="$2"
        onPress={() => {
          dispatch(workoutFinished());
        }}
      >
        Finish
      </Button>
    </View>
  );
}
