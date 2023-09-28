import { FlatList } from "react-native";
import { Text, View, XStack } from "tamagui";
import { useAppSelector } from "../../app/hooks";

export default function List() {
  const workoutRecords = useAppSelector(
    (state) => state.appData.workouts.workoutRecords,
  );
  const allRecords = useAppSelector(
    (state) => state.appData.workouts.allRecords,
  );
  const exercises = useAppSelector(
    (state) => state.appData.workouts.exerciseRecords,
  );
  const tableHeader = Object.keys(exercises);

  const renderHeaderCell = ({ item: headerCell }: { item: string }) => {
    return (
      <View
        f={1}
        borderWidth="$1"
        alignItems="center"
        jc="center"
        borderColor="$color6"
      >
        <Text flexWrap="wrap" textAlign="center">
          {headerCell}
        </Text>
      </View>
    );
  };

  const renderRow = ({ item: exerciseId }: { item: number }) => {
    const record = allRecords[exerciseId];
    return (
      <View f={1} borderWidth="$1" borderColor="$color5">
        <Text>{record.weight}</Text>
      </View>
    );
  };

  const renderTable = ({ item: workout }: { item: number[] }) => {
    return (
      <FlatList
        contentContainerStyle={{ width: "100%" }}
        data={workout}
        renderItem={renderRow}
        horizontal
      />
    );
  };

  return (
    <View f={1}>
      <XStack>
        {tableHeader.map((headerCell) =>
          renderHeaderCell({ item: headerCell }),
        )}
      </XStack>
      <FlatList data={workoutRecords} renderItem={renderTable} />
    </View>
  );
}
