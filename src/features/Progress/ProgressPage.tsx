import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tabs, Text, YStack } from "tamagui";
import Calendar from "./Calendar";
import List from "./List";
import Table from "./Table";
import { useMemo } from "react";
import Graphs from "./Graphs";

export default function ProgressPage() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const tabsList = useMemo(() => ["Table", "List", "Graphs", "Calendar"], []);

  return (
    <YStack paddingTop={insets.top} f={1} marginHorizontal="$2">
      <Tabs defaultValue="tab1" f={1} flexDirection="column">
        <Tabs.List>
          {tabsList.map((tab, index) => (
            <Tabs.Tab
              f={1}
              value={`tab${index + 1}`}
              backgroundColor="$color3"
              key={index}
            >
              <Text fontSize="$1" textAlign="center">
                {tab}
              </Text>
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Content value="tab1" f={1}>
          <Table />
        </Tabs.Content>
        <Tabs.Content value="tab2" f={1}>
          <List />
        </Tabs.Content>
        <Tabs.Content value="tab3" f={1}>
          <Graphs />
        </Tabs.Content>
        <Tabs.Content value="tab4" f={1} key={colorScheme}>
          <Calendar />
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
}
