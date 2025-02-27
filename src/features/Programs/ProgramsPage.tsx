import { ChevronDown, Pencil } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Alert, FlatList } from "react-native";
import {
  AnimatePresence,
  Button,
  Separator,
  Square,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Program } from "../Home/types";
import { programSelected, selectSelectedProgram } from "../Home/workoutsSlice";

export default function ProgramsPage() {
  const [draftsOpen, setDraftsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const programs = useAppSelector(
    (state) => state.appData.workouts.allPrograms,
  );
  const selectedProgram = useAppSelector(selectSelectedProgram);

  console.log(programs);

  const handleProgramSelect = (program: Program) => {
    if (program.id === selectedProgram?.id) return;

    Alert.alert(
      "Switch Program",
      `Are you sure you want to switch the program to ${program.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Switch",
          onPress: () => {
            dispatch(programSelected(program));
          },
        },
      ],
    );
  };

  const Drafts = () => {
    return (
      <View>
        <Separator />
        <Button
          unstyled
          flexDirection="row"
          borderWidth="$0"
          marginHorizontal="$2"
          jc="space-between"
          ai="center"
          p="$4"
          onPress={() => setDraftsOpen(!draftsOpen)}
        >
          <XStack ai="center" space="$3">
            <Text>Drafts</Text>
            <Pencil size="$1" color="$gray11" />
          </XStack>

          <Square animation="quick" rotate={draftsOpen ? "180deg" : "0deg"}>
            <ChevronDown size="$1" />
          </Square>
        </Button>
        <AnimatePresence>
          <View
            f={1}
            zIndex={-1}
            pt="$0"
            animation="quick"
            enterStyle={{ opacity: 0, y: -10 }}
            exitStyle={{ opacity: 0, y: -20 }}
          >
            {/* <FlatList
              style={{ paddingTop: 20 }}
              contentContainerStyle={{
                paddingBottom: 150,
                paddingHorizontal: 15,
              }}
              data={weeksWorkouts}
              renderItem={renderWeeksWorkouts}
            /> */}
          </View>
        </AnimatePresence>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Program }) => {
    // Filter out duplicate exercises
    const allExercises = item.workouts.flatMap((workout) => workout.exercises);
    const exercises = allExercises.filter(
      (exercise, index) =>
        allExercises.findIndex((e) => e.name === exercise.name) === index,
    );

    const isSelected = item.id === selectedProgram?.id;

    return (
      <Button
        unstyled
        onPress={() => handleProgramSelect(item)}
        bg={isSelected ? "$color5" : "transparent"}
        pressStyle={{
          bg: "$color6",
        }}
      >
        <XStack f={1} m="$5">
          <View f={1}>
            <Text fontSize="$8" fontWeight="$8">
              {item.name}
            </Text>
          </View>
          <View f={1}>
            <YStack ai="flex-end" f={1}>
              {exercises.map((exercise) => (
                <Text key={exercise.name}>{exercise.name}</Text>
              ))}
            </YStack>
          </View>
        </XStack>
      </Button>
    );
  };

  return (
    <YStack f={1}>
      <FlatList
        data={programs}
        keyExtractor={(item: Program) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={<Drafts />}
        contentContainerStyle={{ margin: 10 }}
      />
    </YStack>
  );
}
