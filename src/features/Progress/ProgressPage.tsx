import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, Tabs, Text, YStack } from "tamagui";
import Calendar from "./Calendar";
import Graphs from "./Graphs";
import List from "./List";
import Table from "./Table";
import BodyWeight from "./BodyWeight";

export default function ProgressPage() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const tabsList = useMemo(
    () => ["Graphs", "List", "Calendar", "Body Weight"],
    [],
  );

  return (
    <YStack paddingTop={insets.top} f={1}>
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
        {/* <Tabs.Content value="tab3" f={1}>
          <Table />
        </Tabs.Content> */}
        <Tabs.Content value="tab3" f={1} key={colorScheme}>
          <Calendar />
        </Tabs.Content>
        <Tabs.Content value="tab4" f={1}>
          <BodyWeight />
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
}
