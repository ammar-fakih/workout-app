import { useEffect } from "react";

import { StackScreenProps } from "@react-navigation/stack";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Card,
  H3,
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
import { getDayName } from "./helperFunctions";
import { Workout } from "./types";
import {
  programReadFromFile,
  selectWeeksWorkouts,
  weeksWorkoutsSet,
  workoutSelected,
  workoutsReadFromFiles,
} from "./workoutsSlice";

type Props = StackScreenProps<RootStackParamList, "HomePage">;

export default function HomePage({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const weeksWorkouts = useAppSelector(selectWeeksWorkouts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(workoutsReadFromFiles(startingWorkouts));
    dispatch(programReadFromFile(startingProgram));

    dispatch(weeksWorkoutsSet());
  }, []);

  const renderWeeksWorkouts = ({ item }: { item: Workout }) => {
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
          dispatch(workoutSelected(item));
          navigation.navigate("TrackWorkout");
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
    <YStack f={1} bg="$background" pt={insets.top}>
      <XStack>
        <View f={1} />
        <YStack w="100%" ai="center" f={1}>
          <H3>AMMARLIFT</H3>
        </YStack>
        <View f={1} jc="center" ai="center" onPress={() => {}}>
          <Text>Program</Text>
        </View>
      </XStack>

      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        data={weeksWorkouts}
        renderItem={renderWeeksWorkouts}
      />

      {/* Start Workout Card*/}
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
