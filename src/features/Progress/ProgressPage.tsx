import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tabs, Text, YStack } from "tamagui";
import List from "./List";

export default function ProgressPage() {
  const insets = useSafeAreaInsets();
  return (
    <YStack paddingTop={insets.top} f={1}>
      <Tabs defaultValue="tab1" f={1} flexDirection="column" m="$2" space="$2">
        <Tabs.List>
          <Tabs.Tab f={1} value="tab1" backgroundColor="$color3">
            <Text>List</Text>
          </Tabs.Tab>
          <Tabs.Tab f={1} value="tab2" backgroundColor="$color3">
            <Text>Graphs</Text>
          </Tabs.Tab>
          <Tabs.Tab f={1} value="tab3" backgroundColor="$color3">
            <Text>Calendar</Text>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Content value="tab1" f={1}>
          <List />
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
}