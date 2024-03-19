import { createStackNavigator } from "@react-navigation/stack";

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Menu, Plus } from "@tamagui/lucide-icons";
import { Button, Popover, Square, XStack } from "tamagui";
import { RootTabsParamList } from "../../../App";
import StopWatch from "../../Components/StopWatch";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ProgramsPage from "../Programs/ProgramsPage";
import Settings from "../Settings/Settings";
import TrackWorkout from "../TrackWorkout/TrackWorkoutPage";
import HomePage from "./HomePage";
import { workoutCanceled } from "./workoutsSlice";

const Stack = createStackNavigator<RootTabsParamList>();

type Props = BottomTabScreenProps<RootTabsParamList, "Workout">;

export default function Home({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const selectedWorkout = useAppSelector(
    (state) => state.appData.workouts.selectedWorkout,
  );

  const TrackWorkoutHeaderRight = () => {
    return (
      <XStack ai="center">
        <StopWatch />
        <Popover>
          <Popover.Trigger pr="$4">
            <Menu />
          </Popover.Trigger>

          <Popover.Content
            borderWidth={1}
            borderColor="$borderColor"
            enterStyle={{ y: -10, opacity: 0 }}
            exitStyle={{ y: -10, opacity: 0 }}
            elevate
            animation={[
              "quick",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
          >
            <Popover.Close asChild>
              <Button
                onPress={() => {
                  dispatch(workoutCanceled());
                  navigation.navigate("HomePage");
                }}
                color="#fff"
                bg="red"
              >
                Cancel Workout
              </Button>
            </Popover.Close>
          </Popover.Content>
        </Popover>
      </XStack>
    );
  };

  const ProgramsPageHeaderRight = ({ onPress }: { onPress: () => void }) => {
    return (
      <Button
        icon={
          <Square bg="$color5" size="$size.2.5" radiused>
            <Plus size="$2" />
          </Square>
        }
        variant="outlined"
        onPress={onPress}
      />
    );
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{ headerShown: false, title: "Home" }}
      />
      <Stack.Screen
        name="TrackWorkout"
        component={TrackWorkout}
        options={{
          title: selectedWorkout ? selectedWorkout.name : "",
          headerRight: () => <TrackWorkoutHeaderRight />,
        }}
      />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen
        name="Programs"
        component={ProgramsPage}
        options={({ navigation }) => ({
          headerRight: () => (
            <ProgramsPageHeaderRight
              onPress={() => {
                // navigation.navigate("");
              }}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
