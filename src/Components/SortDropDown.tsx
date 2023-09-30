import { Menu } from "@tamagui/lucide-icons";
import { ListItem, Popover, Text, YGroup } from "tamagui";

export default function SortDropDown() {
  return (
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
  );
}
