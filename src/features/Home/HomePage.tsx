import { useEffect } from "react";

import { FlatList } from "react-native";
import { Button, Card, Heading, Text, YStack } from "tamagui";
import myWorkouts from "../../../myWorkout.json";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { dayNames } from "./constants";
import { Workout } from "./types";
import {
  selectTodaysWorkouts,
  todaysWorkoutsSet,
  userDataReadFromFile,
} from "./workoutsSlice";

export default function HomePage() {
  const todaysWorkouts = useAppSelector(selectTodaysWorkouts);
  const dispatch = useAppDispatch();

  const today = new Date();
  // TODO: for debugging. remove for prod
  // today.setDate(today.getDate() + 2);

  useEffect(() => {
    // TODO: remove when async storage is working
    dispatch(userDataReadFromFile(myWorkouts));

    dispatch(todaysWorkoutsSet(today));
  }, []);

  const renderTodaysWorkout = ({
    item,
    index,
  }: {
    item: Workout;
    index: number;
  }) => {
    return (
      <Card>
        <Card.Header>
          <Heading>{item.name ? item.name : index}</Heading>
        </Card.Header>
        <Card.Footer>
          <Button flex={1}>Start</Button>
          <Button flex={1}>Log</Button>
        </Card.Footer>
      </Card>
    );
  };

  return (
    <YStack>
      <Text>{dayNames[today.getDay()]}</Text>
      <Heading>Today's Workouts{!todaysWorkouts && ": Rest!"}</Heading>

      <FlatList
        horizontal
        data={todaysWorkouts}
        renderItem={renderTodaysWorkout}
      />
    </YStack>
  );
}
