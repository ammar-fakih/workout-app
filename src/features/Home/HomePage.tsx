import { useEffect } from "react";

import { StackScreenProps } from "@react-navigation/stack";
import { Plus } from "@tamagui/lucide-icons";
import { FlatList } from "react-native";
import {
  Button,
  Card,
  Heading,
  ScrollView,
  Text,
  XStack,
  YStack,
} from "tamagui";
import { RootStackParamList } from "../../../App";
import myWorkouts from "../../../myWorkout.json";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { dayNames, monthNames } from "./constants";
import { Workout } from "./types";
import {
  selectTodaysWorkouts,
  todaysWorkoutsSet,
  userDataReadFromFile,
} from "./workoutsSlice";

type Props = StackScreenProps<RootStackParamList, "Home">;

export default function HomePage({ navigation }: Props) {
  const todaysWorkouts = useAppSelector(selectTodaysWorkouts);
  const dispatch = useAppDispatch();

  const today = new Date();
  // TODO: for debugging. remove for prod
  // today.setDate(today.getDate() + 2);

  useEffect(() => {
    // TODO: remove when async storage is working
    dispatch(userDataReadFromFile(myWorkouts));

    dispatch(
      todaysWorkoutsSet({ dayNum: today.getDay(), time: today.getTime() }),
    );
  }, []);

  const renderTodaysWorkout = ({
    item,
    index,
  }: {
    item: Workout;
    index: number;
  }) => {
    return (
      <Card p="$3">
        <Card.Header>
          <Heading>{item.name ? item.name : index}</Heading>
        </Card.Header>
        <Card.Footer space="$1">
          <Button
            f={1}
            onPress={() => {
              navigation.navigate("TrackWorkout");
            }}
          >
            Start
          </Button>
        </Card.Footer>
      </Card>
    );
  };

  return (
    <ScrollView flex={1} backgroundColor="$background" p="$4">
      <YStack w="100%">
        <Text>
          {dayNames[today.getDay()]}, {monthNames[today.getMonth()]}{" "}
          {today.getDate()}{" "}
        </Text>
        <XStack jc="space-between">
          <Heading>
            Today's Workout{todaysWorkouts?.length > 1 && "s"}
            {!todaysWorkouts && ": Rest!"}
          </Heading>
          <Button icon={Plus} />
        </XStack>
      </YStack>

      <FlatList
        horizontal
        contentContainerStyle={{ flexGrow: 1 }}
        data={todaysWorkouts}
        renderItem={renderTodaysWorkout}
      />
    </ScrollView>
  );
}
