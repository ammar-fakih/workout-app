import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Button, Input, Text, View, XStack, YStack } from "tamagui";
import { RootTabsParamList } from "../../../App";
import { useState } from "react";
import { Plus } from "@tamagui/lucide-icons";

type Props = BottomTabScreenProps<RootTabsParamList, "CreateWorkoutListPage">;

export default function CreateWorkoutListPage({ navigation }: Props) {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExercise, setCurrentExercise] = useState("");

  const addExercise = () => {
    if (currentExercise.trim()) {
      setExercises([...exercises, currentExercise]);
      setCurrentExercise("");
    }
  };

  const createWorkout = () => {
    if (workoutName && exercises.length > 0) {
      // TODO: Save workout
      navigation.goBack();
    }
  };

  return (
    <YStack f={1} p="$4" space="$4">
      <Text fontSize="$8" fontWeight="bold">Create New Workout</Text>
      
      <Input
        placeholder="Workout Name"
        value={workoutName}
        onChangeText={setWorkoutName}
      />

      <YStack space="$2">
        <Text fontSize="$6" fontWeight="bold">Exercises</Text>
        
        <XStack space="$2">
          <Input
            flex={1}
            placeholder="Add Exercise"
            value={currentExercise}
            onChangeText={setCurrentExercise}
          />
          <Button icon={Plus} onPress={addExercise} />
        </XStack>

        <YStack space="$2">
          {exercises.map((exercise, index) => (
            <Text key={index} fontSize="$5">{exercise}</Text>
          ))}
        </YStack>
      </YStack>

      <Button
        disabled={!workoutName || exercises.length === 0}
        onPress={createWorkout}
      >
        Create Workout
      </Button>
    </YStack>
  );
}
