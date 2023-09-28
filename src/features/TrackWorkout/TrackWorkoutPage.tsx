import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { isEqual } from "lodash";
import { Alert, FlatList, Keyboard } from "react-native";
import {
  Accordion,
  AnimatePresence,
  Button,
  Input,
  Text,
  View,
  XStack,
  YStack,
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

export default function TrackWorkout({ navigation }: Props) {
  const selectedSet = useAppSelector(
    (state) => state.appData.workouts.selectedSet,
  );
  const selectedWorkout = useAppSelector(selectSelectedWorkout);
  const units = useAppSelector((state) => state.appData.workouts.units);
  const dispatch = useAppDispatch();

  const handlePressNextSet = () => {
    dispatch(onPressNextSet());
  };

  const handlePressPreviousSet = () => {
    dispatch(onPressPreviousSet());
  };

  const handlePressExerciseHeader = (
    exerciseIndex: number,
    exerciseSetIndex: number,
  ) => {
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
          paddingHorizontal="$5"
          paddingVertical={isExerciseSelected ? "$6" : "$2"}
          alignItems="center"
          onPress={() => handlePressExerciseHeader(index, 0)}
        >
          <Text>{exercise.name}</Text>
          <Text>{`${exercise.sets}x${exercise.reps}`}</Text>
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
                    <XStack
                      jc="space-around"
                      paddingHorizontal="$3"
                      paddingVertical="$7"
                      bg="$backgroundHover"
                      onPress={() =>
                        handlePressExerciseHeader(index, exerciseSetIndex)
                      }
                    >
                      <AnimatePresence
                        enterVariant="fromTop"
                        exitVariant="fromBottom"
                      >
                        <Button
                          onPress={handlePressPreviousSet}
                          animation="bouncy"
                        >
                          <Text>Prev</Text>
                        </Button>
                      </AnimatePresence>
                      <Button
                        size="$5"
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
                      <Button onPress={handlePressNextSet}>
                        <Text>Next</Text>
                      </Button>
                    </XStack>
                  );
                }
                return <>{setContent}</>;
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
  );
}
