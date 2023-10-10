import { FlatList } from "react-native";
import { Separator, Text, XStack, YStack } from "tamagui";
import { useAppSelector } from "../../app/hooks";
import { Program } from "../Home/types";

export default function ProgramsPage() {
  const programs = useAppSelector(
    (state) => state.appData.workouts.allPrograms,
  );

  const renderItem = ({ item }: { item: Program }) => {
    // Lame version of the above
    const allExercises = item.workouts.flatMap((workout) => workout.exercises);
    const exercises = allExercises.filter(
      (exercise, index) =>
        allExercises.findIndex((e) => e.name === exercise.name) === index,
    );

    return (
      <XStack f={1} m="$5" onPress={() => {}}>
        <Text fontSize="$8" fontWeight="$8">
          {item.name}
        </Text>
        <YStack ai="flex-end" f={1}>
          {exercises.map((exercise) => (
            <Text>{exercise.name}</Text>
          ))}
        </YStack>
      </XStack>
    );
  };
  return (
    <YStack f={1}>
      <FlatList
        data={programs}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={Separator}
        contentContainerStyle={{ margin: 10 }}
      />
    </YStack>
  );
}
