import React, { useEffect, useState } from "react";
import { FlatList, ScrollView } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useAppSelector } from "../../app/hooks";
import {
  Button,
  H3,
  H4,
  Separator,
  Text,
  View,
  XStack,
  YStack,
  useTheme,
} from "tamagui";
import { ArrowLeft, Clock, Dumbbell, FileText } from "@tamagui/lucide-icons";
import { ExerciseRecord, Units, WorkoutRecord } from "../Home/types";
import { getDateString, getUnitAbbreviation } from "../Home/helperFunctions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type WorkoutRecordRouteProps = RouteProp<
  { WorkoutRecordPage: { date: string } },
  "WorkoutRecordPage"
>;

// Helper function to format time in minutes and seconds
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export default function WorkoutRecordPage() {
  const insets = useSafeAreaInsets();
  const route = useRoute<WorkoutRecordRouteProps>();
  const navigation = useNavigation();
  const theme = useTheme();
  const { date } = route.params;

  const [workoutsForDate, setWorkoutsForDate] = useState<
    {
      workoutRecord: WorkoutRecord;
      exercises: ExerciseRecord[];
    }[]
  >([]);

  const allRecords = useAppSelector(
    (state) => state.appData.workouts.allRecords,
  );

  const workoutRecords = useAppSelector(
    (state) => state.appData.workouts.workoutRecords,
  );

  const units = useAppSelector((state) => state.appData.workouts.units);

  useEffect(() => {
    // Find all workout records for this date
    const formattedDate = date;

    const recordsForDate = workoutRecords
      .map((record) => {
        // Get the first exercise to check the date
        const firstExerciseIndex = record.exercises[0];
        const firstExercise = allRecords[firstExerciseIndex];

        if (!firstExercise) return null;

        const exerciseDate = new Date(firstExercise.date);
        const exerciseDateString = exerciseDate.toISOString().split("T")[0];

        // Check if this workout was done on the selected date
        if (exerciseDateString === formattedDate) {
          return {
            workoutRecord: record,
            exercises: record.exercises.map((index) => allRecords[index]),
          };
        }
        return null;
      })
      .filter(
        (
          record,
        ): record is {
          workoutRecord: WorkoutRecord;
          exercises: ExerciseRecord[];
        } => record !== null,
      );

    setWorkoutsForDate(recordsForDate);
  }, [date, workoutRecords, allRecords]);

  const renderExerciseItem = ({ item }: { item: ExerciseRecord }) => {
    // Calculate how many sets were completed
    const completedSets = item.completedSets.filter(
      (set) => set.selected,
    ).length;
    const totalSets = item.sets;
    const unitAbbreviation = getUnitAbbreviation(units);

    return (
      <YStack p="$3" space="$2" borderBottomWidth={1} borderColor="$color3">
        <XStack jc="space-between">
          <Text fontWeight="bold" fontSize="$5">
            {item.name}
          </Text>
          <Text fontSize="$4">
            {item.weight} {unitAbbreviation}
          </Text>
        </XStack>
        <XStack space="$4">
          <Text fontSize="$3" opacity={0.8}>
            {completedSets}/{totalSets} sets
          </Text>
          <Text fontSize="$3" opacity={0.8}>
            {item.reps} reps
          </Text>
        </XStack>
      </YStack>
    );
  };

  const renderWorkoutItem = ({
    item,
    index,
  }: {
    item: { workoutRecord: WorkoutRecord; exercises: ExerciseRecord[] };
    index: number;
  }) => {
    const { workoutRecord, exercises } = item;

    return (
      <YStack
        key={index}
        mt={index > 0 ? "$4" : 0}
        borderWidth={1}
        borderColor="$color5"
        borderRadius="$4"
        overflow="hidden"
      >
        <YStack bg="$color3" p="$3">
          <H3>{workoutRecord.name}</H3>
          <XStack space="$4" mt="$2">
            <XStack space="$1" ai="center">
              <Clock size={16} />
              <Text fontSize="$3">
                {formatTime(workoutRecord.timeToComplete)}
              </Text>
            </XStack>
            <XStack space="$1" ai="center">
              <Dumbbell size={16} />
              <Text fontSize="$3">{exercises.length} exercises</Text>
            </XStack>
          </XStack>
        </YStack>

        <FlatList
          data={exercises}
          renderItem={renderExerciseItem}
          keyExtractor={(item: ExerciseRecord) => item.id}
          scrollEnabled={false}
        />

        {workoutRecord.notes && (
          <YStack p="$3" space="$2" borderTopWidth={1} borderColor="$color3">
            <XStack space="$1" ai="center">
              <FileText size={16} />
              <Text fontWeight="bold">Notes</Text>
            </XStack>
            <Text>{workoutRecord.notes}</Text>
          </YStack>
        )}
      </YStack>
    );
  };

  const formattedDate = new Date(date);

  return (
    <YStack f={1} p="$4" pt={insets.top}>
      <XStack ai="center" space="$2" mb="$4">
        <Button
          size="$3"
          circular
          icon={<ArrowLeft size={16} />}
          onPress={() => navigation.goBack()}
        />
        <H4>{getDateString(formattedDate.toISOString())}</H4>
      </XStack>

      {workoutsForDate.length > 0 ? (
        <ScrollView>
          {/* Summary Section */}
          {workoutsForDate.length > 0 && (
            <YStack
              bg="$color2"
              p="$4"
              mb="$4"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$color5"
            >
              <Text fontWeight="bold" fontSize="$5" mb="$2">
                Workout Summary
              </Text>
              <XStack jc="space-between" flexWrap="wrap">
                <YStack space="$1" mb="$3" mr="$4">
                  <Text fontSize="$3" opacity={0.8}>
                    Workouts
                  </Text>
                  <Text fontWeight="bold" fontSize="$5">
                    {workoutsForDate.length}
                  </Text>
                </YStack>

                <YStack space="$1" mb="$3" mr="$4">
                  <Text fontSize="$3" opacity={0.8}>
                    Exercises
                  </Text>
                  <Text fontWeight="bold" fontSize="$5">
                    {workoutsForDate.reduce(
                      (total, workout) => total + workout.exercises.length,
                      0,
                    )}
                  </Text>
                </YStack>

                <YStack space="$1" mb="$3">
                  <Text fontSize="$3" opacity={0.8}>
                    Total Time
                  </Text>
                  <Text fontWeight="bold" fontSize="$5">
                    {formatTime(
                      workoutsForDate.reduce(
                        (total, workout) =>
                          total + workout.workoutRecord.timeToComplete,
                        0,
                      ),
                    )}
                  </Text>
                </YStack>
              </XStack>
            </YStack>
          )}

          <FlatList
            data={workoutsForDate}
            renderItem={renderWorkoutItem}
            keyExtractor={(
              _: { workoutRecord: WorkoutRecord; exercises: ExerciseRecord[] },
              index: number,
            ) => index.toString()}
            scrollEnabled={false}
          />
        </ScrollView>
      ) : (
        <YStack f={1} jc="center" ai="center" space="$4">
          <Text fontSize="$6" fontWeight="bold">
            No workouts found
          </Text>
          <Text>There are no recorded workouts for this date.</Text>
        </YStack>
      )}
    </YStack>
  );
}
