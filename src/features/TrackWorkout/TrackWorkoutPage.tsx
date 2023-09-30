import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { isEqual } from "lodash";
import { useState } from "react";
import { Alert, FlatList, Keyboard } from "react-native";
import {
  AnimatePresence,
  Button,
  Input,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
  styled,
} from "tamagui";
import { RootTabsParamList } from "../../../App";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getOrdinalNumber, getUnitAbbreviation } from "../Home/helperFunctions";
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
    item: TodaysExercise;
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
        <XStack
          jc="space-between"
          paddingHorizontal="$5"
          paddingVertical={isExerciseSelected ? "$6" : "$2"}
          alignItems="center"
          onPress={() => handlePressExerciseHeader(index, 0)}
        >
          <Text fontWeight="$10">{exercise.name}</Text>
          <Text fontWeight="$10">{`${exercise.sets}x${exercise.reps}`}</Text>
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
                let setContent = <></>;

                if (!isItemSelected) {
                  setContent = (
                    <XStack
                      jc="space-around"
                      alignItems="center"
                      p="$3"
                      onPress={() =>
                        handlePressExerciseHeader(index, exerciseSetIndex)
                      }
                    >
                      <Text>{getOrdinalNumber(exerciseSetIndex + 1)} set</Text>
                    </XStack>
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
                          <Button
                            size="$5"
                            circular
                            bg={set.selected ? "$color7" : "$color1"}
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
                          <Text>Reps</Text>
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
            {/* Weight Chooser */}
            <YStack ai="center" space="$2">
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

              <Text fontWeight="200">Last Workout: </Text>
            </YStack>
          </YStack>
        )}
      </YStack>
    );
  };

  return (
    <ScrollView flex={1} onPress={Keyboard.dismiss} m="$2">
      <View f={1}>
        {selectedWorkout.exercises.map((exercise, index) => {
          return renderItem({ item: exercise, index });
        })}
      </View>
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
    </ScrollView>
  );
}
