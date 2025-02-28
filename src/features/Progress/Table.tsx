import { useEffect, useState, useMemo } from "react";
import { FlatList } from "react-native-gesture-handler";
import {
  ScrollView,
  Text,
  TextParentStyles,
  View,
  XStack,
  YStack,
  H4,
} from "tamagui";
import FilterMenu from "../../Components/FilterMenu";
import SortByMenu from "../../Components/SortByMenu";
import { useAppSelector } from "../../app/hooks";
import {
  getDateString,
  formatWeights,
  getUnitAbbreviation,
} from "../Home/helperFunctions";
import { ExerciseRecord, WorkoutRecordData } from "../Home/types";

const borderWidth = 1;

export const HeaderCell = ({
  item: headerCell,
  index,
  textStyles,
}: {
  item: string;
  index: number;
  textStyles?: TextParentStyles;
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
      width="$8"
    >
      <Text flexWrap="wrap" textAlign="center" style={textStyles}>
        {headerCell}
      </Text>
    </View>
  );
};

export const TableCell = ({
  item: text,
  index,
  renderTopBorder,
  redBackground,
}: {
  item: string;
  index: number;
  renderTopBorder: boolean;
  redBackground?: boolean;
}) => {
  return (
    <View
      f={1}
      paddingVertical="$2"
      borderRightWidth={borderWidth}
      borderLeftWidth={index === 0 ? borderWidth : 0}
      borderBottomWidth={borderWidth}
      borderTopWidth={renderTopBorder ? borderWidth : 0}
      borderColor="$color3"
      key={index}
      width="$10"
      bg={redBackground ? "red" : "transparent"}
      opacity={redBackground ? 0.5 : 1}
    >
      <Text textAlign="center">{text || "/"}</Text>
    </View>
  );
};

export default function Table() {
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecordData[]>();
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const workoutRecordIds = useAppSelector(
    (state) => state.appData.workouts.workoutRecords,
  );
  const allRecords = useAppSelector(
    (state) => state.appData.workouts.allRecords,
  );
  const exercises = useAppSelector(
    (state) => state.appData.workouts.exerciseRecords,
  );
  const selectedProgram = useAppSelector(
    (state) => state.appData.workouts.selectedProgram,
  );

  const [selectedPrograms, setSelectedPrograms] = useState<Set<string>>(
    new Set([selectedProgram?.id || "all"]),
  );

  // Get filtered workout records based on selected programs
  const getWorkoutRecords = () => {
    return workoutRecordIds
      .map((record) => ({
        exercises: record.exercises.map((exerciseId) => allRecords[exerciseId]),
        name: record.name,
        programId: record.programId,
        programName: record.programName,
      }))
      .filter((record) => {
        // If "all" is selected or no program filter is active, show all records
        if (selectedPrograms.has("all")) return true;
        // Otherwise only show if the program is selected
        return record.programId && selectedPrograms.has(record.programId);
      });
  };

  // Calculate filtered exercise headers based on selected programs
  const filteredExerciseHeaders = useMemo(() => {
    if (selectedPrograms.has("all")) {
      // If "all" programs selected, show all exercises
      return Object.keys(exercises);
    }

    // Get all exercises from the selected programs
    const exercisesInSelectedPrograms = new Set<string>();

    // Get all workout records for selected programs
    const filteredRecords = workoutRecordIds.filter(
      (record) => record.programId && selectedPrograms.has(record.programId),
    );

    // Collect all exercise names from these records
    filteredRecords.forEach((record) => {
      record.exercises.forEach((exerciseId) => {
        const exercise = allRecords[exerciseId];
        if (exercise) {
          exercisesInSelectedPrograms.add(exercise.name);
        }
      });
    });

    // Return only exercise names that are in the selected programs
    return Object.keys(exercises).filter((exerciseName) =>
      exercisesInSelectedPrograms.has(exerciseName),
    );
  }, [selectedPrograms, workoutRecordIds, allRecords, exercises]);

  useEffect(() => {
    setWorkoutRecords(getWorkoutRecords());
    setTableHeader(filteredExerciseHeaders);
  }, [allRecords, selectedPrograms, filteredExerciseHeaders]);

  // Update selected programs when global program changes
  useEffect(() => {
    if (selectedProgram?.id) {
      setSelectedPrograms(new Set([selectedProgram.id]));
      setWorkoutRecords(getWorkoutRecords());
    }
  }, [selectedProgram]);

  const onPressDateAsc = () => {
    if (!workoutRecords?.length) return;

    const sortedWorkoutRecords = [...workoutRecords];
    sortedWorkoutRecords.sort((a, b) => {
      const aDate = a.exercises[0]?.date;
      const bDate = b.exercises[0]?.date;
      return aDate > bDate ? 1 : -1;
    });
    setWorkoutRecords(sortedWorkoutRecords);
  };

  const onPressDateDesc = () => {
    if (!workoutRecords?.length) return;

    const sortedWorkoutRecords = [...workoutRecords];
    sortedWorkoutRecords.sort((a, b) => {
      const aDate = a.exercises[0]?.date;
      const bDate = b.exercises[0]?.date;
      return aDate < bDate ? 1 : -1;
    });
    setWorkoutRecords(sortedWorkoutRecords);
  };

  const onHideProgram = (programId: string) => {
    const newSelectedPrograms = new Set(selectedPrograms);
    newSelectedPrograms.delete(programId);
    // If no programs are selected, show all
    if (newSelectedPrograms.size === 0) {
      newSelectedPrograms.add("all");
    }
    setSelectedPrograms(newSelectedPrograms);
  };

  const onShowProgram = (programId: string) => {
    const newSelectedPrograms = new Set(selectedPrograms);
    // If selecting a specific program, remove "all"
    if (programId !== "all") {
      newSelectedPrograms.delete("all");
    } else {
      // If selecting "all", clear other selections
      newSelectedPrograms.clear();
    }
    newSelectedPrograms.add(programId);
    setSelectedPrograms(newSelectedPrograms);
  };

  const wasExerciseCompleted = (exercise: ExerciseRecord | undefined) => {
    return (
      !exercise ||
      exercise.completedSets.find((set) => !set.selected) === undefined
    );
  };

  const renderRow = ({
    item: workout,
    index,
  }: {
    item: { exercises: ExerciseRecord[]; name: string };
    index: number;
  }) => {
    const rowData: (ExerciseRecord | undefined)[] = [];
    tableHeader.forEach((exerciseName) => {
      rowData.push(
        workout.exercises.find((record) => record?.name === exerciseName),
      );
    });
    const date = workout.exercises[0]
      ? getDateString(workout.exercises[0].date)
      : "/";

    return (
      <XStack f={1} key={index}>
        <TableCell item={date} index={0} renderTopBorder={!index} />
        {rowData.map((record, cellIndex) => (
          <TableCell
            item={
              record
                ? formatWeights(record.completedSets || [], record.weight)
                : "/"
            }
            key={cellIndex + 1}
            index={cellIndex + 1}
            renderTopBorder={!index}
            redBackground={!wasExerciseCompleted(record)}
          />
        ))}
      </XStack>
    );
  };

  if (!workoutRecords?.length)
    return (
      <YStack ai="center" space="$2" m="$3">
        <Text fontWeight="$8" fontSize="$5">
          No Records Yet
        </Text>
        <Text>Log some workouts to see them here</Text>
      </YStack>
    );

  return (
    <View f={1}>
      <XStack>
        <SortByMenu
          onPressDateAsc={onPressDateAsc}
          onPressDateDesc={onPressDateDesc}
        />
        <FilterMenu
          selectedPrograms={selectedPrograms}
          onHideProgram={onHideProgram}
          onShowProgram={onShowProgram}
          programs={[
            { id: "all", name: "All Programs" },
            ...workoutRecordIds
              .reduce((acc, record) => {
                if (record.programId && record.programName) {
                  acc.set(record.programId, {
                    id: record.programId,
                    name: record.programName,
                  });
                }
                return acc;
              }, new Map())
              .values(),
          ]}
        />
      </XStack>
      <ScrollView horizontal pl="$2">
        <YStack>
          <XStack>
            <HeaderCell item="Date" index={0} />
            {tableHeader.map((headerCell, index) => (
              <HeaderCell item={headerCell} index={index + 1} key={index + 1} />
            ))}
          </XStack>
          <FlatList
            alwaysBounceVertical={false}
            data={workoutRecords}
            renderItem={renderRow}
          />
        </YStack>
      </ScrollView>
    </View>
  );
}
