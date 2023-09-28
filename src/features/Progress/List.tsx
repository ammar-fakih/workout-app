import { FlatList } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";
import { useAppSelector } from "../../app/hooks";
import { RecordEntry } from "../Home/types";

const borderWidth = "$1";

export default function List() {
  const workoutRecordIds = useAppSelector(
    (state) => state.appData.workouts.workoutRecords,
  );
  const allRecords = useAppSelector(
    (state) => state.appData.workouts.allRecords,
  );
  const exercises = useAppSelector(
    (state) => state.appData.workouts.exerciseRecords,
  );
  const tableHeader = ["date", ...Object.keys(exercises)];
  const workoutRecords = workoutRecordIds.map((exercise) =>
    exercise.map((exerciseId) => allRecords[exerciseId]),
  );

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
      >
        <Text flexWrap="wrap" textAlign="center">
          {headerCell}
        </Text>
      </View>
    );
  };

  const renderCell = ({
    item: record,
    index,
  }: {
    item: RecordEntry;
    index: number;
  }) => {
    return (
      <View f={1} borderWidth="$1" borderColor="$color3" key={index}>
        <Text textAlign="center">{record.weight}</Text>
      </View>
    );
  };

  const renderRow = ({
    item: workout,
    index,
  }: {
    item: RecordEntry[];
    index: number;
  }) => {
    let rowData: RecordEntry | null[] = [];
    tableHeader.forEach((exerciseName) => {
      // const foundExercise = workout.find((record) => record.) 
    });
    return (
      <XStack f={1} key={index}>
        {workout.map((exerciseId, index) =>
          renderCell({ item: exerciseId, index }),
        )}
      </XStack>
    );
  };

  if (!workoutRecords.length)
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
        {tableHeader.map((headerCell, index) =>
          renderHeaderCell({ item: headerCell, index }),
        )}
      </XStack>
      <FlatList data={workoutRecords} renderItem={renderRow} />
    </View>
  );
}
