import React from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { isEqual } from "lodash";
import { useState, useMemo } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  AnimatePresence,
  Button,
  Input,
  Text,
  View,
  XStack,
  YStack,
  styled,
  Stack,
} from "tamagui";
import { RootTabsParamList } from "../../../App";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  DEFAULT_ADD_WEIGHT_IMPERIAL,
  DEFAULT_ADD_WEIGHT_METRIC,
} from "../Home/constants";
import { getOrdinalNumber, getUnitAbbreviation } from "../Home/helperFunctions";
import { CompletedSet, SelectedExercise, Units } from "../Home/types";
import {
  exerciseSetClicked,
  exerciseWeightChanged,
  onEditSelectedWorkoutNotes,
  onPressExerciseSet,
  onPressNextSet,
  onPressPreviousSet,
  selectSelectedWorkout,
  workoutFinished,
} from "../Home/workoutsSlice";

type Props = BottomTabScreenProps<RootTabsParamList, "TrackWorkout">;

const XStackEnterable = styled(XStack, {
  variants: {
    isUp: { true: { y: 10 } },
    isDown: { true: { y: -10 } },
    isDisabled: { true: { opacity: 1 } },
  } as const,
});

export default function TrackWorkout({ navigation }: Props) {
  const [animationDirection, setAnimationDirection] = useState<
    "isUp" | "isDown" | "isDisabled"
  >("isDisabled");
  const selectedSet = useAppSelector(
    (state) => state.appData.workouts.selectedSet,
  );
  const selectedWorkout = useAppSelector(selectSelectedWorkout);
  const units = useAppSelector((state) => state.appData.workouts.units);
  const dispatch = useAppDispatch();

  // Calculate total sets and completed sets for progress bar
  const workoutProgress = useMemo(() => {
    if (!selectedWorkout)
      return { totalSets: 0, completedSets: 0, setStatus: [] };

    let totalSets = 0;
    let completedSets = 0;
    const setStatus: ("completed" | "current" | "skipped" | "pending")[] = [];

    selectedWorkout.exercises.forEach((exercise, exerciseIndex) => {
      exercise.completedSets.forEach((set, setIndex) => {
        totalSets++;

        // Mark current set
        if (
          selectedSet &&
          selectedSet[0] === exerciseIndex &&
          selectedSet[1] === setIndex
        ) {
          setStatus.push("current");
        }
        // Mark completed sets
        else if (set.selected) {
          completedSets++;
          setStatus.push("completed");
        }
        // Mark skipped sets (if a later set in the same exercise or a later exercise has been completed)
        else if (
          exercise.completedSets.some((s, i) => i > setIndex && s.selected) ||
          selectedWorkout.exercises.some(
            (ex, i) =>
              i > exerciseIndex && ex.completedSets.some((s) => s.selected),
          )
        ) {
          setStatus.push("skipped");
        }
        // Mark pending sets
        else {
          setStatus.push("pending");
        }
      });
    });

    return { totalSets, completedSets, setStatus };
  }, [selectedWorkout, selectedSet]);

  const getAddWeight = () => {
    return units === Units.IMPERIAL
      ? DEFAULT_ADD_WEIGHT_IMPERIAL
      : DEFAULT_ADD_WEIGHT_METRIC;
  };

  const handlePressNextSet = () => {
    setAnimationDirection("isDown");
    dispatch(onPressNextSet());
  };

  const handlePressPreviousSet = () => {
    setAnimationDirection("isUp");
    dispatch(onPressPreviousSet());
  };

  const handlePressExerciseHeader = (
    exerciseIndex: number,
    exerciseSetIndex: number,
  ) => {
    setAnimationDirection("isDisabled");
    dispatch(onPressExerciseSet({ exerciseIndex, exerciseSetIndex }));
  };

  if (!selectedWorkout) return null;

  const renderItem = ({
    item: exercise,
    index,
  }: {
    item: SelectedExercise;
    index: number;
  }) => {
    const isExerciseSelected = index === selectedSet?.[0];
    return (
      <YStack
        p="$2"
        borderRadius={isExerciseSelected ? "$10" : 0}
        key={exercise.id}
        borderWidth={isExerciseSelected ? "$0.5" : 0}
        borderColor="$color7"
      >
        {/* Header */}
        <Button unstyled onPress={() => handlePressExerciseHeader(index, -1)}>
          <XStack
            jc="space-between"
            paddingHorizontal="$5"
            paddingVertical={isExerciseSelected ? "$6" : "$2"}
            alignItems="center"
          >
            <Text fontWeight="$10" fontSize="$6">
              {exercise.name}
            </Text>
            <Text
              fontWeight="$10"
              fontSize="$6"
            >{`${exercise.sets}x${exercise.reps}`}</Text>
          </XStack>
        </Button>

        {/* Body */}
        {isExerciseSelected && (
          <YStack space="$6" pb="$4">
            <FlatList
              scrollEnabled={false}
              data={exercise.completedSets}
              renderItem={({
                item: set,
                index: exerciseSetIndex,
              }: {
                item: CompletedSet;
                index: number;
              }) => {
                const isItemSelected = isEqual(selectedSet, [
                  index,
                  exerciseSetIndex,
                ]);
                let setContent = <></>;

                if (!isItemSelected) {
                  setContent = (
                    <Button
                      unstyled
                      onPress={() =>
                        handlePressExerciseHeader(index, exerciseSetIndex)
                      }
                    >
                      <XStack jc="space-around" alignItems="center" p="$3">
                        <Text>
                          {getOrdinalNumber(exerciseSetIndex + 1)} set
                        </Text>
                      </XStack>
                    </Button>
                  );
                } else {
                  setContent = (
                    <AnimatePresence enterVariant={animationDirection}>
                      <XStackEnterable
                        opacity={1}
                        y={0}
                        animation="medium"
                        jc="space-around"
                        borderRadius="$radius.3"
                        ai="center"
                        paddingHorizontal="$3"
                        paddingVertical="$7"
                        bg="$color5"
                        onPress={() =>
                          handlePressExerciseHeader(index, exerciseSetIndex)
                        }
                      >
                        <Button onPress={handlePressPreviousSet}>
                          <Text>Prev</Text>
                        </Button>
                        <YStack space="$space.3" ai="center" jc="center">
                          <XStack space="$2" ai="center">
                            <Button
                              size="$3"
                              circular
                              onPress={() => {
                                dispatch(
                                  exerciseSetClicked({
                                    exerciseIndex: index,
                                    exerciseSetIndex,
                                  }),
                                );
                              }}
                            >
                              <Text fontSize="$4">-</Text>
                            </Button>
                            <Button
                              size="$5"
                              circular
                              bg={set.selected ? "$color7" : "$color1"}
                              onPress={() => {
                                if (
                                  set.repCount === exercise.reps &&
                                  !set.selected
                                ) {
                                  // Just mark as completed without changing rep count
                                  dispatch(
                                    exerciseSetClicked({
                                      exerciseIndex: index,
                                      exerciseSetIndex,
                                    }),
                                  );
                                } else if (set.selected && set.repCount === 0) {
                                  // Reset to default
                                  dispatch(
                                    exerciseSetClicked({
                                      exerciseIndex: index,
                                      exerciseSetIndex,
                                    }),
                                  );
                                } else {
                                  // Toggle between completed and not completed
                                  Alert.alert(
                                    "Set Completion",
                                    "What would you like to do?",
                                    [
                                      {
                                        text: "Mark Incomplete",
                                        style: "destructive",
                                        onPress: () => {
                                          dispatch(
                                            exerciseSetClicked({
                                              exerciseIndex: index,
                                              exerciseSetIndex,
                                              markIncomplete: true,
                                            }),
                                          );
                                        },
                                      },
                                      {
                                        text: "Cancel",
                                        style: "cancel",
                                      },
                                    ],
                                  );
                                }
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
                            <Button
                              size="$3"
                              circular
                              onPress={() => {
                                dispatch(
                                  exerciseSetClicked({
                                    exerciseIndex: index,
                                    exerciseSetIndex,
                                    incrementReps: true,
                                  }),
                                );
                              }}
                            >
                              <Text fontSize="$4">+</Text>
                            </Button>
                          </XStack>
                          <Text>Reps</Text>
                          {set.repCount > exercise.reps && (
                            <Text fontSize="$2" color="$color7">
                              {set.repCount - exercise.reps} extra
                            </Text>
                          )}

                          {/* Per-set weight controls */}
                          <XStack space="$2" ai="center" mt="$2">
                            <Button
                              size="$2"
                              onPress={() => {
                                dispatch(
                                  exerciseWeightChanged({
                                    exerciseId: exercise.id,
                                    weightChange: -getAddWeight(),
                                    setIndex: exerciseSetIndex,
                                  }),
                                );
                              }}
                            >
                              <Text fontSize="$3">-</Text>
                            </Button>
                            <XStack ai="center" space="$1">
                              <Text opacity={0}>
                                {getUnitAbbreviation(units)}
                              </Text>
                              <Input
                                keyboardType="numeric"
                                width={70}
                                textAlign="center"
                                onChangeText={(text: string) => {
                                  dispatch(
                                    exerciseWeightChanged({
                                      exerciseId: exercise.id,
                                      newWeight: Number(text),
                                      setIndex: exerciseSetIndex,
                                    }),
                                  );
                                }}
                                value={(set.weight !== undefined
                                  ? set.weight
                                  : exercise.weight
                                ).toString()}
                              />
                              <Text opacity={0.5}>
                                {getUnitAbbreviation(units)}
                              </Text>
                            </XStack>
                            <Button
                              size="$2"
                              onPress={() => {
                                dispatch(
                                  exerciseWeightChanged({
                                    exerciseId: exercise.id,
                                    weightChange: getAddWeight(),
                                    setIndex: exerciseSetIndex,
                                  }),
                                );
                              }}
                            >
                              <Text fontSize="$3">+</Text>
                            </Button>
                          </XStack>
                        </YStack>
                        <Button onPress={handlePressNextSet}>
                          <Text>Next</Text>
                        </Button>
                      </XStackEnterable>
                    </AnimatePresence>
                  );
                }
                return <>{setContent}</>;
              }}
            />
            {/* Weight Chooser - Default weight for all sets */}
            <YStack ai="center" space="$2">
              <Text fontWeight="500">Target Max Weight</Text>
              <XStack space="$4" jc="center">
                <Button
                  onPress={() => {
                    dispatch(
                      exerciseWeightChanged({
                        exerciseId: exercise.id,
                        weightChange: -getAddWeight(),
                      }),
                    );
                  }}
                >
                  <Text>{`-${getAddWeight()}`}</Text>
                </Button>
                <XStack ai="center" space="$2">
                  <Text opacity={0}>{getUnitAbbreviation(units)}</Text>
                  <Input
                    keyboardType="numeric"
                    onChangeText={(text: string) => {
                      dispatch(
                        exerciseWeightChanged({
                          exerciseId: exercise.id,
                          newWeight: Number(text),
                        }),
                      );
                    }}
                    value={(exercise.weight || 0).toString()}
                  />
                  <Text opacity={0.5}>{getUnitAbbreviation(units)}</Text>
                </XStack>
                <Button
                  onPress={() => {
                    dispatch(
                      exerciseWeightChanged({
                        exerciseId: exercise.id,
                        weightChange: getAddWeight(),
                      }),
                    );
                  }}
                >
                  <Text>{`+${getAddWeight()}`}</Text>
                </Button>
              </XStack>

              {/* Apply default weight to all sets button */}
              <AnimatePresence>
                {exercise.weight !== exercise.startingWeight &&
                  exercise.completedSets.some(
                    (set) => set.weight !== exercise.weight,
                  ) && (
                    <YStack
                      animation="medium"
                      opacity={1}
                      height="$4"
                      enterStyle={{ opacity: 0, height: 0 }}
                      exitStyle={{ opacity: 0, height: 0 }}
                      paddingVertical="$1"
                    >
                      <Button
                        size="$2"
                        onPress={() => {
                          // Apply default weight to all sets
                          exercise.completedSets.forEach((_, setIndex) => {
                            dispatch(
                              exerciseWeightChanged({
                                exerciseId: exercise.id,
                                newWeight: exercise.weight,
                                setIndex,
                              }),
                            );
                          });
                        }}
                      >
                        <Text>Apply to All Sets</Text>
                      </Button>
                    </YStack>
                  )}
              </AnimatePresence>

              <Text fontWeight="200">
                {`Last Workout: ${
                  exercise.startingWeight !== undefined
                    ? exercise.startingWeight.toString()
                    : "0"
                } ${getUnitAbbreviation(units)}`}
              </Text>
            </YStack>
          </YStack>
        )}
      </YStack>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View flex={1} onPress={Keyboard.dismiss} m="$2" mt="$0">
        <FlatList
          data={selectedWorkout.exercises}
          renderItem={renderItem}
          ListHeaderComponent={
            <XStack p="$2" space="$0.5" justifyContent="center">
              {workoutProgress.setStatus.map((status, index) => (
                <Stack
                  key={index}
                  flex={1}
                  height="$1"
                  maxWidth={20}
                  backgroundColor={
                    status === "completed"
                      ? "$color7"
                      : status === "current"
                      ? "$color10"
                      : status === "skipped"
                      ? "$color5"
                      : "$color3"
                  }
                  opacity={status === "skipped" ? 0.5 : 1}
                />
              ))}
            </XStack>
          }
          ListFooterComponent={
            <View>
              <Input
                m="$4"
                placeholder="Notes..."
                minHeight={70}
                multiline
                value={selectedWorkout.notes}
                onChangeText={(text: string) =>
                  dispatch(onEditSelectedWorkoutNotes(text))
                }
              />
              <Button
                margin="$4"
                marginTop="$10"
                onPress={() => {
                  Alert.alert("Are you sure you want to finish?", "", [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Finish",
                      onPress: () => {
                        dispatch(workoutFinished());
                        navigation.navigate("HomePage");
                      },
                    },
                  ]);
                }}
              >
                Finish
              </Button>
            </View>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}
