import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tabs, Text, YStack } from "tamagui";

export default function Calendar() {
  const insets = useSafeAreaInsets();
  return (
    <YStack backgroundColor="$background" paddingTop={insets.top} f={1}>
      <Tabs defaultValue="tab1">
        <Tabs.List f={1} m="$2">
          <Tabs.Tab f={1} value="tab1" backgroundColor="$color3">
            <Text>List</Text>
          </Tabs.Tab>
          <Tabs.Tab f={1} value="tab2" backgroundColor="$color3">
            <Text>Graph</Text>
          </Tabs.Tab>
          <Tabs.Tab f={1} value="tab3" backgroundColor="$color3">
            <Text>Calendar</Text>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </YStack>
  );
}
