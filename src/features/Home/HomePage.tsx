import { useEffect } from "react";

import { StackScreenProps } from "@react-navigation/stack";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Card,
  H1,
  Separator,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { RootStackParamList } from "../../../App";
import startingProgram from "../../../startingProgram.json";
import startingWorkouts from "../../../startingWorkouts.json";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { monthNames } from "./constants";
import {
  getDayName,
  getFullDayName,
  renderExerciseLabel,
} from "./helperFunctions";
import { TodaysWorkout } from "./types";
import {
  programReadFromFile,
  selectWeeksWorkouts,
  todaysWorkoutsSet,
  weeksWorkoutsSet,
  workoutSelected,
  workoutsReadFromFiles,
} from "./workoutsSlice";

type Props = StackScreenProps<RootStackParamList, "HomePage">;

export default function HomePage({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const units = useAppSelector((state) => state.appData.workouts.units);
  const weeksWorkouts = useAppSelector(selectWeeksWorkouts);
  const todaysWorkout = useAppSelector(
    (state) => state.appData.workouts.todaysWorkout,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(workoutsReadFromFiles(startingWorkouts));
    dispatch(programReadFromFile(startingProgram));

    dispatch(weeksWorkoutsSet());
    dispatch(todaysWorkoutsSet());
  }, []);

  const onPressWorkout = (workout: TodaysWorkout) => {
    dispatch(workoutSelected(workout));
    navigation.navigate("TrackWorkout");
  };

  const renderWeeksWorkouts = ({ item }: { item: TodaysWorkout }) => {
    const nextTime = new Date(item.closestTimeToNow!);
    return (
      <Card
        key={item.workoutId}
        p="$3"
        marginVertical="$2"
        borderLeftWidth={nextTime.getDay() === new Date().getDay() ? 2 : 0}
        borderWidth={1}
        borderColor="$color8"
        marginHorizontal="$4"
        onPress={() => {
          onPressWorkout(item);
        }}
      >
        <View fd="row" jc="space-between" p="$2" pb="$3">
          <Text fontSize="$1" fontWeight="bold">
            {item.name}
          </Text>
          <Text fontSize="$1" fontWeight="bold">
            {getDayName(nextTime)}, {monthNames[nextTime.getMonth()]}{" "}
            {nextTime.getDate()}
          </Text>
        </View>

        <FlatList
          data={item.exercises}
          ItemSeparatorComponent={Separator}
          renderItem={({ item: exercise, index: exerciseIndex }) => (
            <View
              p="$2"
              fd="row"
              jc="space-between"
              key={`${item.workoutId} ${exerciseIndex}`}
            >
              <View>
                <Text>{exercise.name}</Text>
              </View>
              <View>
                <Text>{renderExerciseLabel(exercise, units)}</Text>
              </View>
            </View>
          )}
        />
      </Card>
    );
  };

  return (
    <YStack f={1} bg="$background" pt={insets.top}>
      <XStack>
        <View f={1} />
        <YStack w="100%" ai="center" f={1} p="$2.5">
          <H1 fontFamily="$gerhaus" size="$5">
            LIFT-IQ
          </H1>
        </YStack>
        <Button f={1} m="$0" p="$0" onPress={() => {}} variant="outlined">
          <Text>Program</Text>
        </Button>
      </XStack>

      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        data={weeksWorkouts}
        renderItem={renderWeeksWorkouts}
      />

      {/* Start Workout Card*/}
      {todaysWorkout && (
        <Card
          h="$10"
          p="$5"
          pos="absolute"
          right="$5"
          left="$5"
          bottom="$4"
          fd="row"
          jc="space-between"
          ai="center"
          shadowRadius={4}
          shadowOpacity={0.4}
        >
          <XStack jc="space-between" alignItems="center" flex={1}>
            <YStack space="$2">
              <Text fontSize="$1">{getFullDayName()}</Text>
              <Text>Today's Workout: {todaysWorkout.name}</Text>
            </YStack>

            <Button
              onPress={() => {
                dispatch(workoutSelected(todaysWorkout));
                navigation.navigate("TrackWorkout");
              }}
            >
              <Text>Start</Text>
            </Button>
          </XStack>
        </Card>
      )}
    </YStack>
  );
}
