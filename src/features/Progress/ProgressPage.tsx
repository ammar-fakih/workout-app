import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Plus } from "@tamagui/lucide-icons";
import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, ScrollView, Tabs, Text, XStack, YStack } from "tamagui";
import { RootTabsParamList } from "../../../App";
import BodyWeight from "./BodyWeight";
import Calendar from "./Calendar";
import Graphs from "./Graphs";
import List from "./List";
import Table from "./Table";

type ProgressNavigationProp = StackNavigationProp<RootTabsParamList>;

export default function ProgressPage() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const navigation = useNavigation<ProgressNavigationProp>();

  const tabsList = useMemo(
    () => ["Graphs", "List", "Table", "Calendar", "Body Weight"],
    [],
  );

  return (
    <YStack paddingTop={insets.top} f={1}>
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$2"
        paddingBottom="$2"
      >
        <Text fontSize="$6" fontWeight="bold">
          Progress
        </Text>
        <Button
          size="$3"
          icon={<Plus size={16} />}
          onPress={() => navigation.navigate("LogPastWorkoutPage")}
        >
          Log Past Workout
        </Button>
      </XStack>

      <Tabs defaultValue="tab1" f={1} flexDirection="column">
        <Tabs.List>
          <ScrollView horizontal space="$2" paddingHorizontal="$2">
            {tabsList.map((tab, index) => (
              <Tabs.Tab
                f={1}
                value={`tab${index + 1}`}
                backgroundColor="$color3"
                key={index}
                pV="$3"
                pH="$5"
              >
                <Text textAlign="center">{tab}</Text>
              </Tabs.Tab>
            ))}
          </ScrollView>
        </Tabs.List>

        <Tabs.Content value="tab1" f={1}>
          <Graphs />
        </Tabs.Content>
        <Tabs.Content value="tab2" f={1}>
          <List />
        </Tabs.Content>
        <Tabs.Content value="tab3" f={1}>
          <Table />
        </Tabs.Content>
        <Tabs.Content value="tab4" f={1} key={colorScheme}>
          <Calendar />
        </Tabs.Content>
        <Tabs.Content value="tab5" f={1}>
          <BodyWeight />
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
}
