import React, { useState } from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  Button,
  H3,
  Input,
  Label,
  Separator,
  Text,
  View,
  XStack,
  YStack,
  useTheme,
  TextArea,
  Select,
} from "tamagui";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash,
} from "@tamagui/lucide-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { v4 as uuidv4 } from "uuid";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CompletedSet, ExerciseRecord, WorkoutRecord } from "../Home/types";

export default function LogPastWorkoutPage() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const allWorkouts = useAppSelector(
    (state) => state.appData.workouts.allWorkouts,
  );

  // Form state
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDate, setWorkoutDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("0");
  const [exercises, setExercises] = useState<
    Array<{
      id: string;
      name: string;
      sets: number;
      reps: number;
      weight: number;
      completedSets: CompletedSet[];
    }>
  >([]);

  // Handle date change
  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setWorkoutDate(selectedDate);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Add a new exercise to the form
  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: uuidv4(),
        name: "",
        sets: 3,
        reps: 8,
        weight: 0,
        completedSets: Array(3).fill({ repCount: 8, selected: true }),
      },
    ]);
  };

  // Remove an exercise from the form
  const removeExercise = (index: number) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(index, 1);
    setExercises(updatedExercises);
  };

  // Update exercise details
  const updateExercise = (index: number, field: string, value: any) => {
    const updatedExercises = [...exercises];
    const exercise = { ...updatedExercises[index] };

    if (field === "name") {
      exercise.name = value;
    } else if (field === "sets") {
      const newSets = parseInt(value);
      if (!isNaN(newSets) && newSets > 0) {
        exercise.sets = newSets;
        // Update completedSets array to match new sets count
        if (newSets > exercise.completedSets.length) {
          // Add more sets
          exercise.completedSets = [
            ...exercise.completedSets,
            ...Array(newSets - exercise.completedSets.length).fill({
              repCount: exercise.reps,
              selected: true,
            }),
          ];
        } else if (newSets < exercise.completedSets.length) {
          // Remove excess sets
          exercise.completedSets = exercise.completedSets.slice(0, newSets);
        }
      }
    } else if (field === "reps") {
      const newReps = parseInt(value);
      if (!isNaN(newReps) && newReps > 0) {
        exercise.reps = newReps;
        // Update all completedSets to have the new rep count
        exercise.completedSets = exercise.completedSets.map((set) => ({
          ...set,
          repCount: newReps,
        }));
      }
    } else if (field === "weight") {
      const newWeight = parseFloat(value);
      if (!isNaN(newWeight) && newWeight >= 0) {
        exercise.weight = newWeight;
      }
    }

    updatedExercises[index] = exercise;
    setExercises(updatedExercises);
  };

  // Save the workout to the store
  const saveWorkout = () => {
    if (!workoutName.trim() || exercises.length === 0) {
      // Show error or validation message
      return;
    }

    // Create exercise records
    const exerciseRecords: ExerciseRecord[] = exercises.map((exercise) => ({
      ...exercise,
      date: workoutDate.toISOString(),
    }));

    // Dispatch action to add workout record
    dispatch({
      type: "workouts/logPastWorkout",
      payload: {
        workoutName,
        workoutDate: workoutDate.toISOString(),
        workoutNotes,
        workoutDuration: parseInt(workoutDuration) || 0,
        exercises: exerciseRecords,
      },
    });

    // Navigate back to progress page
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <YStack
        paddingTop={insets.top}
        f={1}
        backgroundColor={theme.background.val}
      >
        <XStack paddingHorizontal="$4" paddingVertical="$2" alignItems="center">
          <Button
            size="$3"
            chromeless
            circular
            icon={<ArrowLeft size={16} />}
            onPress={() => navigation.goBack()}
          />
          <H3 marginLeft="$4">Log Past Workout</H3>
        </XStack>

        <Separator />

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          <YStack space="$4">
            {/* Workout Name */}
            <YStack space="$2">
              <Label htmlFor="workout-name">Workout Name</Label>
              <Input
                id="workout-name"
                placeholder="Enter workout name"
                value={workoutName}
                onChangeText={setWorkoutName}
              />
            </YStack>

            {/* Workout Date */}
            <YStack space="$2">
              <Label htmlFor="workout-date">Workout Date</Label>
              <XStack alignItems="center" space="$2">
                <Button
                  flex={1}
                  icon={<CalendarIcon size={16} />}
                  onPress={() => setShowDatePicker(true)}
                >
                  {formatDate(workoutDate)}
                </Button>
                {showDatePicker && (
                  <DateTimePicker
                    value={workoutDate}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                    maximumDate={new Date()}
                  />
                )}
              </XStack>
            </YStack>

            {/* Workout Duration */}
            <YStack space="$2">
              <Label htmlFor="workout-duration">Duration (minutes)</Label>
              <Input
                id="workout-duration"
                placeholder="Enter duration in minutes"
                value={workoutDuration}
                onChangeText={setWorkoutDuration}
                keyboardType="numeric"
              />
            </YStack>

            {/* Exercises */}
            <YStack space="$4">
              <XStack justifyContent="space-between" alignItems="center">
                <Label>Exercises</Label>
                <Button
                  size="$3"
                  icon={<Plus size={16} />}
                  onPress={addExercise}
                >
                  Add Exercise
                </Button>
              </XStack>

              {exercises.length === 0 ? (
                <YStack
                  padding="$4"
                  borderWidth={1}
                  borderColor="$borderColor"
                  borderRadius="$4"
                  alignItems="center"
                >
                  <Text>No exercises added yet</Text>
                  <Button
                    marginTop="$2"
                    size="$3"
                    icon={<Plus size={16} />}
                    onPress={addExercise}
                  >
                    Add Exercise
                  </Button>
                </YStack>
              ) : (
                exercises.map((exercise, index) => (
                  <YStack
                    key={exercise.id}
                    space="$2"
                    padding="$4"
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderRadius="$4"
                  >
                    <XStack justifyContent="space-between" alignItems="center">
                      <Label>Exercise {index + 1}</Label>
                      <Button
                        size="$2"
                        circular
                        icon={<Trash size={14} />}
                        onPress={() => removeExercise(index)}
                      />
                    </XStack>

                    <YStack space="$2">
                      <Label htmlFor={`exercise-name-${index}`}>Name</Label>
                      <Input
                        id={`exercise-name-${index}`}
                        placeholder="Exercise name"
                        value={exercise.name}
                        onChangeText={(value: string) =>
                          updateExercise(index, "name", value)
                        }
                      />
                    </YStack>

                    <XStack space="$2">
                      <YStack flex={1} space="$2">
                        <Label htmlFor={`exercise-sets-${index}`}>Sets</Label>
                        <Input
                          id={`exercise-sets-${index}`}
                          placeholder="Sets"
                          value={exercise.sets.toString()}
                          onChangeText={(value: string) =>
                            updateExercise(index, "sets", value)
                          }
                          keyboardType="numeric"
                        />
                      </YStack>

                      <YStack flex={1} space="$2">
                        <Label htmlFor={`exercise-reps-${index}`}>Reps</Label>
                        <Input
                          id={`exercise-reps-${index}`}
                          placeholder="Reps"
                          value={exercise.reps.toString()}
                          onChangeText={(value: string) =>
                            updateExercise(index, "reps", value)
                          }
                          keyboardType="numeric"
                        />
                      </YStack>

                      <YStack flex={1} space="$2">
                        <Label htmlFor={`exercise-weight-${index}`}>
                          Weight
                        </Label>
                        <Input
                          id={`exercise-weight-${index}`}
                          placeholder="Weight"
                          value={exercise.weight.toString()}
                          onChangeText={(value: string) =>
                            updateExercise(index, "weight", value)
                          }
                          keyboardType="numeric"
                        />
                      </YStack>
                    </XStack>
                  </YStack>
                ))
              )}

              {/* Add Exercise Button at the bottom of the list */}
              {exercises.length > 0 && (
                <Button
                  size="$4"
                  icon={<Plus size={18} />}
                  onPress={addExercise}
                  alignSelf="center"
                  marginTop="$2"
                  marginBottom="$2"
                  width="60%"
                >
                  Add Another Exercise
                </Button>
              )}
            </YStack>

            {/* Notes */}
            <YStack space="$2">
              <Label htmlFor="workout-notes">Notes</Label>
              <TextArea
                id="workout-notes"
                placeholder="Enter any notes about this workout"
                value={workoutNotes}
                onChangeText={setWorkoutNotes}
                minHeight={100}
              />
            </YStack>

            {/* Save Button */}
            <Button
              size="$5"
              theme="active"
              onPress={saveWorkout}
              marginTop="$4"
              marginBottom="$8"
            >
              Save Workout
            </Button>
          </YStack>
        </ScrollView>
      </YStack>
    </KeyboardAvoidingView>
  );
}
