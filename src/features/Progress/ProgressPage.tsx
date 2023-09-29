import { Menu } from "@tamagui/lucide-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, ListItem, Popover, Tabs, Text, YGroup, YStack } from "tamagui";
import List from "./List";
import Table from "./Table";

const dropDownOptions = []

export default function ProgressPage() {
  const insets = useSafeAreaInsets();
  return (
    <YStack paddingTop={insets.top} f={1}>
      <Popover>
        <Popover.Trigger pr="$4">
          <Menu />
        </Popover.Trigger>

        <Popover.Content
          borderWidth={1}
          borderColor="$borderColor"
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          elevate
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <Text>Sort By</Text>
          <YGroup>
            <YGroup.Item>
              <ListItem>
                <Text>Exercise</Text>
              </ListItem>
            </YGroup.Item>
          </YGroup>
        </Popover.Content>
      </Popover>
      <Tabs defaultValue="tab1" f={1} flexDirection="column" m="$2" space="$2">
        <Tabs.List>
          <Tabs.Tab f={1} value="tab1" backgroundColor="$color3">
            <Text>Table</Text>
          </Tabs.Tab>
          <Tabs.Tab f={1} value="tab2" backgroundColor="$color3">
            <Text>List</Text>
          </Tabs.Tab>
          <Tabs.Tab f={1} value="tab3" backgroundColor="$color3">
            <Text>Graphs</Text>
          </Tabs.Tab>
          <Tabs.Tab f={1} value="tab4" backgroundColor="$color3">
            <Text>Calendar</Text>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Content value="tab1" f={1}>
          <Table />
        </Tabs.Content>
        <Tabs.Content value="tab2" f={1}>
          <List />
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
}
