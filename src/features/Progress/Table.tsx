import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";
import FilterMenu from "../../Components/FilterMenu";
import SortByMenu from "../../Components/SortByMenu";
import { useAppSelector } from "../../app/hooks";
import { getDateString } from "../Home/helperFunctions";
import { ExerciseRecord, WorkoutRecordData } from "../Home/types";

const borderWidth = "$1";

export default function Table() {
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecordData[]>();
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(
    new Set(),
  );

  const workoutRecordIds = useAppSelector(
    (state) => state.appData.workouts.workoutRecords,
  );
  const allRecords = useAppSelector(
    (state) => state.appData.workouts.allRecords,
  );
  const exercises = useAppSelector(
    (state) => state.appData.workouts.exerciseRecords,
  );

  useEffect(() => {
    setWorkoutRecords(getWorkoutRecords());
    setTableHeader(Object.keys(exercises));
    setSelectedExercises(new Set(Object.keys(exercises)));
  }, [allRecords]);

  const getWorkoutRecords = () => {
    return workoutRecordIds.map((record) => ({
      exercises: record.exercises.map((exerciseId) => allRecords[exerciseId]),
      name: record.name,
    }));
  };

  const onPressDateAsc = () => {
    if (!workoutRecords?.length) return;

    const sortedWorkoutRecords = [...workoutRecords];
    sortedWorkoutRecords.sort((a, b) => {
      const aDate = a.exercises[0].date;
      const bDate = b.exercises[0].date;
      return aDate > bDate ? 1 : -1;
    });
    setWorkoutRecords(sortedWorkoutRecords);
  };

  const onPressDateDesc = () => {
    if (!workoutRecords?.length) return;

    const sortedWorkoutRecords = [...workoutRecords];
    sortedWorkoutRecords.sort((a, b) => {
      const aDate = a.exercises[0].date;
      const bDate = b.exercises[0].date;
      return aDate < bDate ? 1 : -1;
    });
    setWorkoutRecords(sortedWorkoutRecords);
  };

  const onHideExercise = (exerciseName: string) => {
    const newSelectedExercises = new Set(selectedExercises);
    newSelectedExercises.delete(exerciseName);
    setSelectedExercises(newSelectedExercises);
  };

  const onShowExercise = (exerciseName: string) => {
    const newSelectedExercises = new Set(selectedExercises);
    newSelectedExercises.add(exerciseName);
    setSelectedExercises(newSelectedExercises);
  };

  const renderHeaderCell = ({
    item: headerCell,
    index,
  }: {
    item: string;
    index: number;
  }) => {
    return (
      <View
        key={index}
        f={1}
        alignItems="center"
        jc="center"
        borderColor="$color5"
        borderWidth={borderWidth}
        borderLeftWidth={index === 0 ? borderWidth : 0}
        width="$10"
      >
        <Text flexWrap="wrap" textAlign="center">
          {headerCell}
        </Text>
      </View>
    );
  };

  const renderCell = ({
    item: text,
    index,
    shouldRenderTopBorder,
  }: {
    item: string;
    index: number;
    shouldRenderTopBorder: boolean;
  }) => {
    return (
      <View
        f={1}
        paddingVertical="$2"
        borderRightWidth={borderWidth}
        borderLeftWidth={index === 0 ? borderWidth : 0}
        borderBottomWidth={borderWidth}
        borderTopWidth={shouldRenderTopBorder ? borderWidth : 0}
        borderColor="$color3"
        key={index}
        width="$10"
      >
        <Text textAlign="center">{text}</Text>
      </View>
    );
  };

  const renderRow = ({
    item: workout,
    index,
  }: {
    item: { exercises: ExerciseRecord[]; name: string };
    index: number;
  }) => {
    const rowData: (ExerciseRecord | undefined)[] = [];
    selectedExercises.forEach((exerciseName) => {
      rowData.push(
        workout.exercises.find((record) => record.name === exerciseName),
      );
    });
    const date = rowData[0] ? getDateString(rowData[0].date) : "/";

    return (
      <XStack f={1} key={index}>
        {renderCell({
          item: date,
          index: 0,
          shouldRenderTopBorder: !index,
        })}
        {rowData.map(
          (record, cellIndex) =>
            (!record || selectedExercises.has(record.name)) &&
            renderCell({
              item: record ? record.weight.toString() : "/",
              index: cellIndex + 1,
              shouldRenderTopBorder: !index,
            }),
        )}
      </XStack>
    );
  };

  if (!workoutRecords?.length)
    return (
      <YStack ai="center" space="$2" m="$3">
        <Text fontWeight="$8" fontSize="$5">
          No Records Yet
        </Text>
        <Text>Log a workout to see it here</Text>
      </YStack>
    );

  return (
    <View f={1}>
      <XStack>
        <SortByMenu
          onPressDateAsc={onPressDateAsc}
          onPressDateDesc={onPressDateDesc}
        />
        <FilterMenu
          exercises={tableHeader}
          selectedExercises={selectedExercises}
          onHideExercise={onHideExercise}
          onShowExercise={onShowExercise}
        />
      </XStack>
      <ScrollView horizontal>
        <YStack>
          <XStack>
            {renderHeaderCell({ item: "Date", index: 0 })}
            {tableHeader.map(
              (headerCell, index) =>
                selectedExercises.has(headerCell) &&
                renderHeaderCell({ item: headerCell, index: index + 1 }),
            )}
          </XStack>
          <FlatList
            alwaysBounceVertical={false}
            data={workoutRecords}
            renderItem={renderRow}
          />
        </YStack>
      </ScrollView>
    </View>
  );
}
