import React, { useEffect } from "react";

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ChevronDown, Settings2 } from "@tamagui/lucide-icons";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Accordion,
  AnimatePresence,
  Button,
  Card,
  H3,
  H4,
  Separator,
  Square,
  Text,
  XStack,
  YStack,
} from "tamagui";
import { RootTabsParamList } from "../../../App";
import startingProgram from "../../../startingProgram.json";
import startingWorkouts from "../../../startingWorkouts.json";
import WorkoutCard from "../../Components/WorkoutCard";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
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
    if (!todaysWorkout) {
      return (
        <XStack
          jc="space-between"
          ai="center"
          marginHorizontal="$4"
          marginVertical="$6"
        >
          <H4>Rest Day</H4>
          <Button
            variant="outlined"
            onPress={() => navigation.navigate("Programs")}
          >
            Program
          </Button>
        </XStack>
      );
    }

    return (
      <YStack>
        <XStack jc="space-between" ai="center" marginHorizontal="$4">
          <H4>Today's Workout</H4>
          <Button
            variant="outlined"
            onPress={() => navigation.navigate("Programs")}
          >
            Program
          </Button>
        </XStack>
        <WorkoutCard
          onPressWorkout={() => onPressWorkout(todaysWorkout)}
          date={todaysWorkout.closestTimeToNow}
          exercises={todaysWorkout.exercises}
          name={todaysWorkout.name}
        />
      </YStack>
    );
  };

  const renderWeeksWorkouts = ({ item }: { item: TodaysWorkout }) => {
    return (
      <WorkoutCard
        onPressWorkout={() => onPressWorkout(item)}
        date={item.closestTimeToNow}
        exercises={item.exercises}
        name={item.name}
      />
    );
  };

  return (
    <YStack f={1}>
      {/* Header */}
      <XStack jc="space-between" bg="$color2" pt={insets.top}>
        <Button disabled variant="outlined">
          <H3 fontFamily="$gerhaus">LIFT-IQ</H3>
        </Button>
        <Button
          icon={<Settings2 size="$2" />}
          variant="outlined"
          onPress={() => navigation.navigate("Settings")}
        />
      </XStack>

      {renderTodaysWorkout()}
      <Separator />

      {/* Other Week's Workouts */}
      <Accordion
        type="multiple"
        defaultValue={todaysWorkout ? undefined : ["a1"]}
      >
        <Accordion.Item value="a1">
          <Accordion.Trigger
            flexDirection="row"
            borderWidth="$0"
            marginHorizontal="$2"
            jc="space-between"
            ai="center"
          >
            {({ open }: { open: boolean }) => (
              <>
                <Text>Other Workouts This Week</Text>
                <Square animation="quick" rotate={open ? "180deg" : "0deg"}>
                  <ChevronDown size="$1" />
                </Square>
              </>
            )}
          </Accordion.Trigger>

          <AnimatePresence>
            <Accordion.Content
              zIndex={-1}
              paddingVertical="$0"
              animation="quick"
              enterStyle={{ opacity: 0, y: -10 }}
              exitStyle={{ opacity: 0, y: -20 }}
            >
              <FlatList
                style={{ paddingBottom: 120, paddingTop: 20 }}
                data={weeksWorkouts}
                renderItem={renderWeeksWorkouts}
                keyExtractor={(item) => item.workoutId}
              />
            </Accordion.Content>
          </AnimatePresence>
        </Accordion.Item>
      </Accordion>
      {/* Start Workout Card*/}
      {selectedWorkout && (
        <Card
          bg="$color5"
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
          shadowOpacity={0.1}
          onPress={() => {
            navigation.navigate("TrackWorkout");
          }}
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
