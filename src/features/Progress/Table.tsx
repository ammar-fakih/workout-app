import { FlatList } from "react-native";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";
import { useAppSelector } from "../../app/hooks";
import { RecordEntry } from "../Home/types";

const borderWidth = "$1";

export default function Table() {
  const workoutRecordIds = useAppSelector(
    (state) => state.appData.workouts.workoutRecords,
  );
  const allRecords = useAppSelector(
    (state) => state.appData.workouts.allRecords,
  );
  const exercises = useAppSelector(
    (state) => state.appData.workouts.exerciseRecords,
  );
  const tableHeader = [...Object.keys(exercises)];
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
        width="$10"
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
    item: RecordEntry | undefined;
    index: number;
  }) => {
    return (
      <View
        f={1}
        borderWidth="$1"
        borderColor="$color3"
        key={index}
        width="$10"
      >
        <Text textAlign="center">{record ? record.weight : "/"}</Text>
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
    const rowData: (RecordEntry | undefined)[] = [];
    tableHeader.forEach((exerciseName) => {
      rowData.push(workout.find((record) => record.name === exerciseName));
    });

    return (
      <XStack f={1} key={index}>
        {rowData.map((exerciseId, index) =>
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
      <ScrollView horizontal>
        <YStack>
          <XStack>
            {tableHeader.map((headerCell, index) =>
              renderHeaderCell({ item: headerCell, index }),
            )}
          </XStack>
          <FlatList data={workoutRecords} renderItem={renderRow} />
        </YStack>
      </ScrollView>
    </View>
  );
}
