import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { Button, Text, ToggleGroup, XStack, YStack } from "tamagui";
import { RootTabsParamList } from "../../../App";
import { reset as resetAppDataSlice } from "../../app/appDataSlice";
import { showToast } from "../../app/functions";
import { useAppSelector } from "../../app/hooks";
import { Units } from "../Home/types";
import { reset as resetWorkoutSlice, unitsSet, importAppData } from "../Home/workoutsSlice";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

type Props = BottomTabScreenProps<RootTabsParamList, "Settings">;

export default function Settings({ navigation }: Props) {
  const dispatch = useDispatch();
  const units = useAppSelector((state) => state.appData.workouts.units);
  const workoutRecords = useAppSelector(
    (state) => state.appData.workouts.workoutRecords,
  );
  const allRecords = useAppSelector(
    (state) => state.appData.workouts.allRecords,
  );
  const exerciseRecords = useAppSelector(
    (state) => state.appData.workouts.exerciseRecords,
  );
  const appState = useAppSelector((state) => state.appData);

  const reset = () => {
    Alert.alert(
      "Are you sure you want to reset the app?",
      "All workouts, programs, and history will be deleted",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          onPress: () => {
            dispatch(resetWorkoutSlice());
            dispatch(resetAppDataSlice());
            showToast("App reset");
            navigation.navigate("HomePage");
          },
          style: "destructive",
        },
      ],
    );
  };

  const onUnitsChange = (units: Units) => {
    dispatch(unitsSet(units));
  };

  const exportWorkoutsToCSV = async () => {
    try {
      // Create CSV header
      let csvContent =
        "Date,Workout Name,Exercise Name,Weight,Sets,Reps,Program\n";

      // Add data rows
      workoutRecords.forEach((record) => {
        const workoutName = record.name;
        const programName = record.programName || "No Program";

        record.exercises.forEach((exerciseIndex) => {
          const exercise = allRecords[exerciseIndex];
          if (exercise) {
            const date = new Date(exercise.date).toLocaleDateString();
            const exerciseName = exercise.name;
            const weight = exercise.weight;
            const sets = exercise.sets;
            const reps = exercise.reps;

            csvContent += `${date},"${workoutName}","${exerciseName}",${weight},${sets},${reps},"${programName}"\n`;
          }
        });
      });

      // Save to file
      const fileUri = `${FileSystem.documentDirectory}workout_data.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent);

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
        showToast("Workout data exported successfully");
      } else {
        showToast("Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error exporting workouts:", error);
      showToast("Failed to export workout data");
    }
  };

  const exportAppBackup = async () => {
    try {
      // Convert app state to JSON
      const jsonContent = JSON.stringify(appState);

      // Save to file
      const fileUri = `${FileSystem.documentDirectory}workout_app_backup_${
        new Date().toISOString().split("T")[0]
      }.json`;
      await FileSystem.writeAsStringAsync(fileUri, jsonContent);

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
        showToast("App backup exported successfully");
      } else {
        showToast("Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error creating backup:", error);
      showToast("Failed to create app backup");
    }
  };

  const importAppBackup = async () => {
    try {
      // Pick a document
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      // Read the file content
      // Handle both the new API format (result.assets[0].uri) and the old format (result.uri)
      const fileUri = result.assets?.[0]?.uri || result.uri;
      
      if (!fileUri) {
        showToast("Failed to get file URI");
        return;
      }
      
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      
      // Parse the JSON
      const backupData = JSON.parse(fileContent);
      
      // Confirm with the user
      Alert.alert(
        "Import Backup",
        "This will replace all your current data with the backup data. Are you sure you want to continue?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Import",
            onPress: () => {
              // Import the data
              if (backupData.workouts) {
                dispatch(importAppData(backupData));
                showToast("Backup imported successfully");
                navigation.navigate("HomePage");
              } else {
                showToast("Invalid backup file format");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error importing backup:", error);
      showToast("Failed to import backup");
    }
  };

  return (
    <YStack bg="$background" f={1} m="$4" space="$4">
      <XStack space="$4" jc="center" ai="center">
        <Text>Units</Text>
        <ToggleGroup
          disableDeactivation
          type="single"
          size="$5"
          value={units}
          onValueChange={onUnitsChange}
        >
          <ToggleGroup.Item value={Units.IMPERIAL}>
            <Text>LB</Text>
          </ToggleGroup.Item>
          <ToggleGroup.Item value={Units.METRIC}>
            <Text>KG</Text>
          </ToggleGroup.Item>
        </ToggleGroup>
      </XStack>

      <YStack space="$2">
        <Text fontSize="$5" fontWeight="bold">
          Export Data
        </Text>
        <Button onPress={exportWorkoutsToCSV} theme="active">
          Export Workouts to CSV
        </Button>
        <Button onPress={exportAppBackup} theme="active">
          Backup App Data
        </Button>
        <Button onPress={importAppBackup} theme="blue">
          Import Backup
        </Button>
      </YStack>

      <Button onPress={reset} theme="red">
        Reset App
      </Button>
    </YStack>
  );
}
