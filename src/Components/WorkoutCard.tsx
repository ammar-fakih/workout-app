import React from "react";

import { FlatList } from "react-native";
import { Card, Separator, Text, View } from "tamagui";
import { useAppSelector } from "../app/hooks";
import { monthNames } from "../features/Home/constants";
import {
  getDayName,
  renderExerciseLabel,
} from "../features/Home/helperFunctions";
import { TodaysExercise } from "../features/Home/types";
import { Units } from "../features/Home/types";

type Props = {
  name: string;
  date: string;
  exercises: TodaysExercise[];
  onPressWorkout: () => void;
};

export default function WorkoutCard({
  name,
  date,
  exercises,
  onPressWorkout,
}: Props) {
  const units = useAppSelector((state) => state.appData.workouts.units);
  const nextTimeDate = new Date(date || new Date().toISOString());

  const renderExercise = ({
    item: exercise,
    index: exerciseIndex,
  }: {
    item: TodaysExercise;
    index: number;
  }) => {
    if (!exercise) {
      return (
        <View p="$2" fd="row" jc="space-between" key={exerciseIndex}>
          <View>
            <Text>Unknown Exercise</Text>
          </View>
          <View>
            <Text></Text>
          </View>
        </View>
      );
    }

    return (
      <View p="$2" fd="row" jc="space-between" key={exerciseIndex}>
        <View>
          <Text>{exercise.name || "Unknown"}</Text>
        </View>
        <View>
          <Text>{renderExerciseLabel(exercise, units || Units.IMPERIAL)}</Text>
        </View>
      </View>
    );
  };

  return (
    <Card
      p="$3"
      bg="$background"
      marginVertical="$2"
      borderLeftWidth={nextTimeDate.getDay() === new Date().getDay() ? 2 : 0}
      borderWidth="$0.5"
      shadowOpacity={0.1}
      shadowRadius="$radius.2"
      borderColor="$color8"
      shadowColor="$color8"
      marginHorizontal="$4"
      onPress={onPressWorkout}
    >
      <View fd="row" jc="space-between" p="$2" pb="$3">
        <Text fontSize="$1" fontWeight="bold">
          {name || "Unnamed Workout"}
        </Text>
        <Text fontSize="$1" fontWeight="bold">
          {getDayName(nextTimeDate)}, {monthNames[nextTimeDate.getMonth()]}{" "}
          {nextTimeDate.getDate()}
        </Text>
      </View>

      <FlatList
        data={exercises || []}
        scrollEnabled={false}
        ItemSeparatorComponent={Separator}
        renderItem={renderExercise}
      />
    </Card>
  );
}
