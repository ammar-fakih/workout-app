import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { Button, Text, ToggleGroup, XStack, YStack } from "tamagui";
import { RootTabsParamList } from "../../../App";
import { reset as resetAppDataSlice } from "../../app/appDataSlice";
import { showToast } from "../../app/functions";
import { useAppSelector } from "../../app/hooks";
import { Units } from "../Home/types";
import { reset as resetWorkoutSlice, unitsSet } from "../Home/workoutsSlice";

type Props = BottomTabScreenProps<RootTabsParamList, "Settings">;

export default function Settings({ navigation }: Props) {
  const dispatch = useDispatch();
  const units = useAppSelector((state) => state.appData.workouts.units);

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

  return (
    <YStack bg="$background" f={1} m="$4" space="$4">
      <XStack space="$4" jc="center" ai="center">
        <Text>Units</Text>
        <ToggleGroup
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

      <Button onPress={reset}>Reset App</Button>
    </YStack>
  );
}
