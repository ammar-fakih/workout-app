import { createStackNavigator } from "@react-navigation/stack";

import HomePage from "./HomePage";
import TrackWorkout from "./TrackWorkout/TrackWorkoutPage";

const Stack = createStackNavigator();

export default function Home() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="TrackWorkout" component={TrackWorkout} />
    </Stack.Navigator>
  );
}
