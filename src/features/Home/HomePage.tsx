import React, { useEffect } from "react";

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Settings2 } from "@tamagui/lucide-icons";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, H3, Text, XStack, YStack } from "tamagui";
import { RootTabsParamList } from "../../../App";
import startingProgram from "../../../startingProgram.json";
import startingWorkouts from "../../../startingWorkouts.json";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import WorkoutCard from "../../Components/WorkoutCard";
import { TodaysWorkout } from "./types";
import {
  programReadFromFile,
  selectWeeksWorkouts,
  todaysWorkoutsSet,
  weeksWorkoutsSet,
  workoutSelected,
  workoutsReadFromFiles,
} from "./workoutsSlice";

type Props = BottomTabScreenProps<RootTabsParamList, "HomePage">;

export default function HomePage({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const units = useAppSelector((state) => state.appData.workouts.units);
  const weeksWorkouts = useAppSelector(selectWeeksWorkouts);
  const todaysWorkout = useAppSelector(
    (state) => state.appData.workouts.todaysWorkout,
  );
  const selectedWorkout = useAppSelector(
    (state) => state.appData.workouts.selectedWorkout,
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

  const renderTodaysWorkout = () => {
    if (!todaysWorkout) return null;

    return (
      <WorkoutCard
        onPressWorkout={() => onPressWorkout(todaysWorkout)}
        workout={todaysWorkout}
      />
    );
  };

  const renderWeeksWorkouts = ({ item }: { item: TodaysWorkout }) => {
    return (
      <YStack>
        <WorkoutCard
          key={item.workoutId}
          onPressWorkout={() => onPressWorkout(item)}
          workout={item}
        />
      </YStack>
    );
  };

  return (
    <YStack f={1} pt={insets.top}>
      <XStack jc="space-between">
        <Button disabled variant="outlined">
          <H3 fontFamily="$gerhaus">LIFT-IQ</H3>
        </Button>
        <Button
          icon={<Settings2 size="$2" />}
          variant="outlined"
          onPress={() => navigation.navigate("Settings")}
        />
      </XStack>

      <FlatList
        ListHeaderComponent={renderTodaysWorkout}
        contentContainerStyle={{ paddingBottom: 120 }}
        data={weeksWorkouts}
        renderItem={renderWeeksWorkouts}
      />

      {/* Start Workout Card*/}
      {selectedWorkout && (
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
          <XStack jc="space-between" alignItems="center" f={1}>
            <YStack space="$space.1">
              <Text fontSize="$5">Workout in Progress</Text>
              <Text fontWeight="$10">{selectedWorkout.name}</Text>
            </YStack>
            <Button
              onPress={() => {
                navigation.navigate("TrackWorkout");
              }}
            >
              <Text>Continue</Text>
            </Button>
          </XStack>
        </Card>
      )}
    </YStack>
  );
}
