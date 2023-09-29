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

type Props = {
  onPressWorkout: () => void;
  name: string;
  date: string;
  exercises: TodaysExercise[];
};

export default function WorkoutCard({
  onPressWorkout,
  name,
  date,
  exercises,
}: Props) {
  const units = useAppSelector((state) => state.appData.workouts.units);
  const nextTimeDate = new Date(date);

  return (
    <Card
      p="$3"
      marginVertical="$2"
      borderLeftWidth={nextTimeDate.getDay() === new Date().getDay() ? 2 : 0}
      borderColor="$color8"
      marginHorizontal="$4"
      onPress={onPressWorkout}
    >
      <View fd="row" jc="space-between" p="$2" pb="$3">
        <Text fontSize="$1" fontWeight="bold">
          {name}
        </Text>
        <Text fontSize="$1" fontWeight="bold">
          {getDayName(nextTimeDate)}, {monthNames[nextTimeDate.getMonth()]}{" "}
          {nextTimeDate.getDate()}
        </Text>
      </View>

      <FlatList
        data={exercises}
        scrollEnabled={false}
        ItemSeparatorComponent={Separator}
        renderItem={({ item: exercise, index: exerciseIndex }) => (
          <View p="$2" fd="row" jc="space-between" key={exerciseIndex}>
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
}
