import { ArrowDown, ArrowUp, ListFilter } from "@tamagui/lucide-icons";
import { Button, ListItem, Popover, Separator, Text, YGroup } from "tamagui";

type Props = {
  onPressDateAsc: () => void;
  onPressDateDesc: () => void;
};

export default function SortByMenu({ onPressDateAsc, onPressDateDesc }: Props) {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button icon={ListFilter} variant="outlined">
          <Text>Sort By</Text>
        </Button>
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
        <YGroup
          alignSelf="center"
          bordered
          width={240}
          size="$4"
          separator={<Separator />}
        >
          <YGroup.Item>
            <ListItem
              hoverTheme
              icon={ArrowDown}
              title="Date"
              onPress={onPressDateDesc}
            />
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              hoverTheme
              icon={ArrowUp}
              title="Date"
              onPress={onPressDateAsc}
            />
          </YGroup.Item>
        </YGroup>
      </Popover.Content>
    </Popover>
  );
}
