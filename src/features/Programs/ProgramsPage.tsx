import { MaterialIcons } from "@expo/vector-icons";
import { Dumbbell, Plus } from "@tamagui/lucide-icons";
import { FlatList } from "react-native";
import { Card, Text, YStack } from "tamagui";

// FOR TESTING
const programs = [
  {
    name: "Starting Strength",
    icon: <Dumbbell />,
    exercises: ["Squat", "Bench Press", "Deadlift", "Overhead Press"],
  },
  {
    name: "StrongLifts 5x5",
    icon: <MaterialIcons name="looks-5" size={30} />,
    exercises: ["Squat", "Bench Press", "Deadlift", "Overhead Press"],
  },
  {
    name: "Make Your Own",
    icon: <Plus />,
    exercises: ["Squat", "Bench Press", "Deadlift", "Overhead Press"],
  },
];
export default function ProgramsPage() {
  const renderItem = ({ item }: { item: (typeof programs)[0] }) => {
    return (
      <Card jc="center" ai="center" f={1} height="$7" m="$3" bg="$color5">
        {item.icon}
        <Text>{item.name}</Text>
      </Card>
    );
  };
  return (
    <YStack f={1}>
      <FlatList
        data={programs}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={{ margin: 10 }}
      />
    </YStack>
  );
}
