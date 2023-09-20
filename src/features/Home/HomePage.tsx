import { useEffect } from "react";

import { StackScreenProps } from "@react-navigation/stack";
import { FlatList } from "react-native";
import { Button, Card, H3, Separator, Text, View, YStack } from "tamagui";
import { RootStackParamList } from "../../../App";
import myWorkouts from "../../../myWorkout.json";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { monthNames } from "./constants";
import { calculateNextDay, getDayName } from "./helperFunctions";
import { Workout } from "./types";
import {
  selectWeeksWorkouts,
  userDataReadFromFile,
  weeksWorkoutsSet,
} from "./workoutsSlice";

type Props = StackScreenProps<RootStackParamList, "HomePage">;

export default function HomePage({ navigation }: Props) {
  const weeksWorkouts = useAppSelector(selectWeeksWorkouts);
  const dispatch = useAppDispatch();

  const today = new Date();
  // TODO: for debugging. remove for prod
  // today.setDate(today.getDate() + 2);

  useEffect(() => {
    // TODO: remove when async storage is working
    dispatch(userDataReadFromFile(myWorkouts));

    dispatch(
      weeksWorkoutsSet({ dayNum: today.getDay(), time: today.getTime() }),
    );
  }, []);

  const renderWeeksWorkouts = ({
    item,
    index,
  }: {
    item: Workout;
    index: number;
  }) => {
    const startDate = new Date(item.startDate);
    const nextTime = calculateNextDay(startDate, item.frequency);
    return (
      <Card
        p="$3"
        m="$2"
        onPress={() => {
          navigation.navigate("TrackWorkout");
        }}
      >
        <Card.Header fd="row" jc="space-between">
          <View>
            <Text>{item.name ? item.name : index}</Text>
          </View>
          <View>
            <Text>
              {getDayName(nextTime)}, {monthNames[nextTime.getMonth()]}{" "}
              {nextTime.getDate()}
            </Text>
          </View>
        </Card.Header>

        <FlatList
          data={item.exercises}
          ItemSeparatorComponent={Separator}
          renderItem={({ item: exercise, index }) => (
            <View fd="row" jc="space-between" key={index}>
              <View>
                <Text>{exercise.name}</Text>
              </View>
              <View>
                <Text>
                  {exercise.sets}x{exercise.reps}
                </Text>
              </View>
            </View>
          )}
        />
      </Card>
    );
  };

  return (
    <YStack f={1} bg="$background">
      <YStack w="100%" ai="center">
        <H3>AMMARLIFTS</H3>
      </YStack>

      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={weeksWorkouts}
        renderItem={renderWeeksWorkouts}
      />

      {/* Start Workout Card*/}
      <Card
        w="100%"
        p="$3"
        m="$2"
        pos="absolute"
        bottom="$0"
        fd="row"
        jc="space-between"
      >
        <YStack>
          <Text>Start Workout{`\n`}</Text>
          <Text>Finish in 45min at {}</Text>
        </YStack>
        <Button>
          <Text>Start</Text>
        </Button>
      </Card>
    </YStack>
  );
}
