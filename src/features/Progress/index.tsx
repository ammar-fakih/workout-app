import { createStackNavigator } from "@react-navigation/stack";
import ProgressPage from "./ProgressPage";
import WorkoutRecordPage from "./WorkoutRecordPage";
import LogPastWorkoutPage from "./LogPastWorkoutPage";

const Stack = createStackNavigator();
export default function Progress() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProgressPage"
        component={ProgressPage}
        options={{
          headerShown: false,
          title: "",
        }}
      />
      <Stack.Screen
        name="WorkoutRecordPage"
        component={WorkoutRecordPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LogPastWorkoutPage"
        component={LogPastWorkoutPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
