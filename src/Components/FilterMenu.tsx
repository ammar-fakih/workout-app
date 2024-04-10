import { Check, Filter } from "@tamagui/lucide-icons";
import { useState } from "react";
import { FlatList } from "react-native";
import { Button, Checkbox, H3, ListItem, Sheet, Text, View } from "tamagui";

type Props = {
  exercises: string[];
  selectedExercises: Set<string>;
  onHideExercise: (exercise: string) => void;
  onShowExercise: (exercise: string) => void;
};

export default function FilterMenu({
  exercises,
  selectedExercises,
  onHideExercise,
  onShowExercise,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const onPress = (isChecked: boolean, item: string) => {
    if (isChecked) {
      onHideExercise(item);
    } else {
      onShowExercise(item);
    }
  };

  const renderExercise = ({ item }: { item: string }) => {
    const isChecked = selectedExercises.has(item);
    return (
      <ListItem
        title={item}
        onPress={() => onPress(isChecked, item)}
        icon={
          <Checkbox checked={isChecked} size="$4">
            <Checkbox.Indicator>
              <Check />
            </Checkbox.Indicator>
          </Checkbox>
        }
      />
    );
  };

  return (
    <View>
      <Button
        icon={<Filter />}
        variant="outlined"
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text>Filter</Text>
      </Button>

      <Sheet dismissOnSnapToBottom modal open={isOpen} onOpenChange={setIsOpen}>
        <Sheet.Overlay />
        <Sheet.Handle />

        <Sheet.Frame p="$4">
          <H3>Exercises Shown</H3>
          <FlatList data={exercises} renderItem={renderExercise} />
        </Sheet.Frame>
      </Sheet>
    </View>
  );
}
