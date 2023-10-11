import { createStackNavigator } from "@react-navigation/stack";
import ProgressPage from "./ProgressPage";
import WorkoutRecordPage from "./WorkoutRecordPage";

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
      <Stack.Screen name="WorkoutRecordPage" component={WorkoutRecordPage} />
    </Stack.Navigator>
  );
}
