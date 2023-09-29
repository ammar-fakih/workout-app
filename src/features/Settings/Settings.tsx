import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { Button, YStack } from "tamagui";
import { RootTabsParamList } from "../../../App";
import { reset as resetAppDataSlice } from "../../app/appDataSlice";
import { showToast } from "../../app/functions";
import { reset as resetWorkoutSlice } from "../Home/workoutsSlice";

type Props = BottomTabScreenProps<RootTabsParamList, "Settings">;

export default function Settings({ navigation }: Props) {
  const dispatch = useDispatch();
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

  return (
    <YStack bg="$background" f={1} jc="flex-end">
      <Button onPress={reset} m="$4">
        Reset App
      </Button>
    </YStack>
  );
}
