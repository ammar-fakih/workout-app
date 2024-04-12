import { useMemo } from "react";
import { FlatList } from "react-native";
import { ScrollView, View, XStack, YStack } from "tamagui";
import { useAppSelector } from "../../app/hooks";
import { BodyWeightRecord } from "../Home/types";
import { selectAllBodyWeightRecords } from "../Home/workoutsSlice";
import { HeaderCell, TableCell } from "./Table";

export default function BodyWeight() {
  const records = useAppSelector((state) => selectAllBodyWeightRecords(state));

  const headers = useMemo(
    () => ["Date", "Week Avg", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    [],
  );

  const renderRow = ({ item }: { item: BodyWeightRecord }) => {
    return (
      <XStack f={1}>
        <TableCell item={item.date} index={0} renderTopBorder={true} />
      </XStack>
    );
  };

  return (
    <View f={1}>
      <ScrollView horizontal>
        <YStack>
          <XStack>
            {headers.map((item, index) => (
              <HeaderCell item={item} index={index} key={index} />
            ))}
          </XStack>

          <FlatList
            data={records}
            keyExtractor={(item: BodyWeightRecord) => item.date}
          />
        </YStack>
      </ScrollView>
    </View>
  );
}
