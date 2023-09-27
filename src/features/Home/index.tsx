import { createStackNavigator } from "@react-navigation/stack";

import HomePage from "./HomePage";
import TrackWorkout from "../TrackWorkout/TrackWorkoutPage";
import { useAppSelector } from "../../app/hooks";

const Stack = createStackNavigator();

export default function Home() {
  const selectedWorkout = useAppSelector(
    (state) => state.appData.workouts.selectedWorkout,
  );

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
        options={{ title: selectedWorkout ? selectedWorkout.name : "" }}
      />
    </Stack.Navigator>
  );
}
