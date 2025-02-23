import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Plus } from "@tamagui/lucide-icons";
import { Button, Square } from "tamagui";
import { RootTabsParamList } from "../../../App";
import CreateProgramPage from "./CreateProgramPage";
import ProgramsPage from "./ProgramsPage";
import CreateWorkoutListPage from "./CreateWorkoutListPage";

const Stack = createStackNavigator<RootTabsParamList>();

type Props = BottomTabScreenProps<RootTabsParamList, "Programs">;

export default function Programs({ navigation }: Props) {
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
        name="ProgramsPage"
        component={ProgramsPage}
        options={({ navigation }) => ({
          title: "Programs",
          headerRight: () => (
            <ProgramsPageHeaderRight
              onPress={() => {
                navigation.navigate("CreateProgramPage");
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="CreateProgramPage"
        component={CreateProgramPage}
        options={{
          title: "Create Program",
        }}
      />
      <Stack.Screen
        name="CreateWorkoutListPage"
        component={CreateWorkoutListPage}
        options={{
          title: "",
        }}
      />
    </Stack.Navigator>
  );
}
