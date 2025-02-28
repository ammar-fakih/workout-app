import { Check, Filter } from "@tamagui/lucide-icons";
import { useState } from "react";
import { FlatList } from "react-native";
import {
  Button,
  Checkbox,
  H3,
  ListItem,
  Sheet,
  Text,
  View,
  YStack,
  Separator,
  Circle,
  XStack,
} from "tamagui";

type Program = {
  id: string;
  name: string;
};

type Props = {
  exercises?: string[];
  selectedExercises?: Set<string>;
  onHideExercise?: (exercise: string) => void;
  onShowExercise?: (exercise: string) => void;
  programs: Program[];
  selectedPrograms: Set<string>;
  onHideProgram: (programId: string) => void;
  onShowProgram: (programId: string) => void;
  showExerciseFilters?: boolean;
};

export default function FilterMenu({
  exercises = [],
  selectedExercises = new Set(),
  onHideExercise = () => {},
  onShowExercise = () => {},
  programs,
  selectedPrograms,
  onHideProgram,
  onShowProgram,
  showExerciseFilters = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate number of active filters
  const getActiveFilterCount = () => {
    let count = 0;

    // If not showing all programs (default state)
    if (!selectedPrograms.has("all")) {
      count += selectedPrograms.size;
    }

    // If exercise filtering is enabled and not showing all exercises (default state)
    if (showExerciseFilters && selectedExercises.size !== exercises.length) {
      count += 1; // Count exercise filtering as 1 change
    }

    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const onPressExercise = (isChecked: boolean, item: string) => {
    if (isChecked) {
      onHideExercise(item);
    } else {
      onShowExercise(item);
    }
  };

  const onPressProgram = (isChecked: boolean, item: Program) => {
    if (isChecked) {
      onHideProgram(item.id);
    } else {
      onShowProgram(item.id);
    }
  };

  const renderExercise = ({ item }: { item: string }) => {
    const isChecked = selectedExercises.has(item);
    return (
      <ListItem
        title={item}
        onPress={() => onPressExercise(isChecked, item)}
        icon={
          <Checkbox checked={isChecked} size="$4" disabled>
            <Checkbox.Indicator>
              <Check />
            </Checkbox.Indicator>
          </Checkbox>
        }
      />
    );
  };

  const renderProgram = ({ item }: { item: Program }) => {
    const isChecked = selectedPrograms.has(item.id);
    return (
      <ListItem
        title={item.name}
        onPress={() => onPressProgram(isChecked, item)}
        icon={
          <Checkbox checked={isChecked} size="$4" disabled>
            <Checkbox.Indicator>
              <Check />
            </Checkbox.Indicator>
          </Checkbox>
        }
      />
    );
  };

  const onClearFilters = () => {
    // Reset programs to "all"
    onShowProgram("all");

    // Reset exercises to show all if exercise filtering is enabled
    if (showExerciseFilters) {
      exercises.forEach((exercise) => {
        if (!selectedExercises.has(exercise)) {
          onShowExercise(exercise);
        }
      });
    }
  };

  return (
    <View>
      <Button
        icon={<Filter />}
        variant="outlined"
        onPress={() => setIsOpen(!isOpen)}
      >
        <XStack space="$2" ai="center">
          <Text>Filter</Text>
          {activeFilterCount > 0 && (
            <Circle size="$1" bg="$color5" p="$0.5">
              <Text fontSize="$2" color="$color11">
                {activeFilterCount}
              </Text>
            </Circle>
          )}
        </XStack>
      </Button>

      <Sheet dismissOnSnapToBottom modal open={isOpen} onOpenChange={setIsOpen}>
        <Sheet.Overlay />
        <Sheet.Handle />

        <Sheet.Frame p="$4">
          <YStack space="$4">
            <XStack jc="space-between" ai="center">
              <H3>Filters</H3>
              {activeFilterCount > 0 && (
                <Button variant="outlined" onPress={onClearFilters} size="$3">
                  <Text>Clear Filters</Text>
                </Button>
              )}
            </XStack>
            <YStack>
              <H3>Programs</H3>
              <FlatList data={programs} renderItem={renderProgram} />
            </YStack>
            
            {showExerciseFilters && (
              <>
                <Separator />
                <YStack>
                  <H3>Exercises Shown</H3>
                  <FlatList data={exercises} renderItem={renderExercise} />
                </YStack>
              </>
            )}
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
}
