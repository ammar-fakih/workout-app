import React, { useState, useEffect, useMemo } from "react";
import { FlatList, Dimensions, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import {
  Button,
  H4,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
  useTheme,
} from "tamagui";
import { useAppSelector } from "../../app/hooks";
import { ExerciseRecord, Units } from "../Home/types";
import { getDateString } from "../Home/helperFunctions";
import { ChevronDown, ChevronUp, Filter } from "@tamagui/lucide-icons";

const { width } = Dimensions.get("window");

type ExerciseData = {
  name: string;
  data: { date: string; weight: number; formattedDate: string }[];
  frequency: number;
};

export default function Graphs() {
  const theme = useTheme();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [exerciseData, setExerciseData] = useState<ExerciseData[]>([]);

  const allRecords = useAppSelector(
    (state) => state.appData.workouts.allRecords,
  );
  const exerciseRecords = useAppSelector(
    (state) => state.appData.workouts.exerciseRecords,
  );
  const units = useAppSelector((state) => state.appData.workouts.units);

  // Process the exercise data for charts
  useEffect(() => {
    if (!allRecords.length) return;

    const processedData: { [key: string]: ExerciseData } = {};

    // Process each exercise
    Object.keys(exerciseRecords).forEach((exerciseName) => {
      const indices = exerciseRecords[exerciseName];
      const records = indices.map((index) => allRecords[index]);

      // Sort records by date
      records.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      // Create data points for the chart
      const data = records.map((record) => ({
        date: record.date,
        weight: record.weight,
        formattedDate: getDateString(record.date),
      }));

      processedData[exerciseName] = {
        name: exerciseName,
        data,
        frequency: indices.length,
      };
    });

    // Convert to array and sort by frequency
    const sortedData = Object.values(processedData).sort(
      (a, b) => b.frequency - a.frequency,
    );

    setExerciseData(sortedData);

    // Auto-select the most frequent exercise if none is selected
    if (!selectedExercise && sortedData.length > 0) {
      setSelectedExercise(sortedData[0].name);
    }
  }, [allRecords, exerciseRecords, selectedExercise]);

  // Format data for the selected exercise chart
  const chartData = useMemo(() => {
    if (!selectedExercise) return [];

    const exercise = exerciseData.find((e) => e.name === selectedExercise);
    if (!exercise) return [];

    return exercise.data.map((item, index) => ({
      value: item.weight,
      dataPointText: item.weight.toString(),
      label: index % 2 === 0 ? item.formattedDate : "",
      date: item.formattedDate, // Store date for pointer label
      labelComponent: () =>
        index % 2 === 0 ? (
          <Text
            fontSize={10}
            color={theme.color11.val}
            style={{ transform: [{ rotate: "-45deg" }] }}
          >
            {item.formattedDate}
          </Text>
        ) : null,
    }));
  }, [selectedExercise, exerciseData, theme]);

  // No data to display
  if (!exerciseData.length) {
    return (
      <YStack f={1} ai="center" jc="center" space="$4">
        <H4>No Exercise Data Available</H4>
        <Text>Complete workouts to see your progress</Text>
      </YStack>
    );
  }

  return (
    <ScrollView f={1}>
      <YStack f={1} p="$4" space="$4">
        {/* Exercise Selector */}
        <XStack jc="space-between" ai="center">
          <Button
            onPress={() => setShowExerciseSelector(!showExerciseSelector)}
            icon={showExerciseSelector ? <ChevronUp /> : <ChevronDown />}
            variant="outlined"
          >
            {selectedExercise || "Select Exercise"}
          </Button>

          <Text fontSize="$3" opacity={0.7}>
            {exerciseData.find((e) => e.name === selectedExercise)?.data
              .length || 0}{" "}
            records
          </Text>
        </XStack>

        {/* Exercise Selection List */}
        {showExerciseSelector && (
          <YStack
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$4"
            p="$2"
            maxHeight={200}
          >
            <ScrollView>
              {exerciseData.map((exercise) => (
                <TouchableOpacity
                  key={exercise.name}
                  onPress={() => {
                    setSelectedExercise(exercise.name);
                    setShowExerciseSelector(false);
                  }}
                >
                  <XStack
                    p="$2"
                    jc="space-between"
                    bg={
                      selectedExercise === exercise.name
                        ? "$color5"
                        : "transparent"
                    }
                    borderRadius="$2"
                  >
                    <Text
                      fontWeight={
                        selectedExercise === exercise.name ? "bold" : "normal"
                      }
                    >
                      {exercise.name}
                    </Text>
                    <Text fontSize="$2" opacity={0.7}>
                      {exercise.frequency} workouts
                    </Text>
                  </XStack>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </YStack>
        )}

        {/* Chart */}
        {selectedExercise && chartData.length > 0 && (
          <YStack space="$4" pt="$4">
            <H4 textAlign="center">{selectedExercise} Progress</H4>

            <View ai="center">
              <LineChart
                data={chartData}
                height={250}
                width={width - 40}
                hideDataPoints={false}
                color={theme.color7.val}
                thickness={2}
                startFillColor={theme.color7.val}
                endFillColor={theme.background.val}
                startOpacity={0.4}
                endOpacity={0.1}
                initialSpacing={10}
                spacing={30}
                maxValue={
                  Math.max(...chartData.map((item) => item.value)) * 1.2
                }
                noOfSections={5}
                yAxisColor={theme.color5.val}
                yAxisThickness={1}
                yAxisTextStyle={{ color: theme.color.val }}
                xAxisColor={theme.color5.val}
                xAxisThickness={1}
                textShiftY={-8}
                textShiftX={-8}
                textFontSize={10}
                backgroundColor={theme.background.val}
                rulesColor={theme.color3.val}
                rulesType="dashed"
                showVerticalLines
                verticalLinesColor={theme.color3.val}
                pointerConfig={{
                  pointerStripHeight: 160,
                  pointerStripColor: theme.color7.val,
                  pointerStripWidth: 2,
                  pointerColor: theme.color7.val,
                  radius: 6,
                  pointerLabelWidth: 100,
                  pointerLabelHeight: 90,
                  activatePointersOnLongPress: true,
                  autoAdjustPointerLabelPosition: true,
                  pointerLabelComponent: (items: any) => {
                    if (!items || !items.length) return null;

                    const item = items[0];
                    return (
                      <View
                        p="$2"
                        borderRadius="$2"
                        bg={theme.color2.val}
                        borderColor={theme.color7.val}
                        borderWidth={1}
                      >
                        <Text color={theme.color.val} fontWeight="bold">
                          {item.value} {units === Units.IMPERIAL ? "lbs" : "kg"}
                        </Text>
                        <Text color={theme.color.val} fontSize="$2">
                          {item.date || ""}
                        </Text>
                      </View>
                    );
                  },
                }}
              />
            </View>

            {/* Stats */}
            <XStack jc="space-around" pt="$2">
              {(() => {
                const selectedExerciseData = exerciseData.find(
                  (e) => e.name === selectedExercise,
                );
                return selectedExerciseData &&
                  selectedExerciseData.data.length > 1 ? (
                  <>
                    <YStack ai="center">
                      <Text fontSize="$2" opacity={0.7}>
                        Starting Weight
                      </Text>
                      <Text fontWeight="bold">
                        {selectedExerciseData.data[0]?.weight}
                      </Text>
                    </YStack>

                    <YStack ai="center">
                      <Text fontSize="$2" opacity={0.7}>
                        Current Weight
                      </Text>
                      <Text fontWeight="bold">
                        {selectedExerciseData.data.slice(-1)[0]?.weight}
                      </Text>
                    </YStack>

                    <YStack ai="center">
                      <Text fontSize="$2" opacity={0.7}>
                        Progress
                      </Text>
                      <Text
                        fontWeight="bold"
                        color={getProgressColor(
                          selectedExerciseData.data[0]?.weight || 0,
                          selectedExerciseData.data.slice(-1)[0]?.weight || 0,
                          theme,
                        )}
                      >
                        {getProgressText(
                          selectedExerciseData.data[0]?.weight || 0,
                          selectedExerciseData.data.slice(-1)[0]?.weight || 0,
                        )}
                      </Text>
                    </YStack>
                  </>
                ) : null;
              })()}
            </XStack>
          </YStack>
        )}

        {/* Top Exercises Section */}
        <YStack space="$2" pt="$4">
          <H4>Most Frequent Exercises</H4>
          {exerciseData.slice(0, 3).map((exercise) => (
            <Button
              key={exercise.name}
              variant="outlined"
              mb="$2"
              onPress={() => {
                setSelectedExercise(exercise.name);
                setShowExerciseSelector(false);
              }}
            >
              <XStack jc="space-between" f={1}>
                <Text>{exercise.name}</Text>
                <Text>{exercise.frequency} workouts</Text>
              </XStack>
            </Button>
          ))}
        </YStack>
      </YStack>
    </ScrollView>
  );
}

// Helper functions
function getProgressText(startWeight: number, currentWeight: number): string {
  const diff = currentWeight - startWeight;
  const percentage = (diff / startWeight) * 100;

  if (diff === 0) return "No change";

  const sign = diff > 0 ? "+" : "";
  return `${sign}${diff.toFixed(1)} (${sign}${percentage.toFixed(1)}%)`;
}

function getProgressColor(
  startWeight: number,
  currentWeight: number,
  theme: any,
): string {
  const diff = currentWeight - startWeight;

  if (diff > 0) return theme.green9.val;
  if (diff < 0) return theme.red9.val;
  return theme.color.val;
}
