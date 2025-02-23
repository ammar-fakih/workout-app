import { useMemo, useState } from "react";
import { Button, Card, Input, Text, View, XStack } from "tamagui";
import { Program } from "../Home/types";
import { FlatList } from "react-native";
import { Plus } from "@tamagui/lucide-icons";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootTabsParamList } from "../../../App";

type Props = BottomTabScreenProps<RootTabsParamList, "HomePage">;

export default function CreateProgramPage({ navigation }: Props) {
  const [programDraft, setProgramDraft] = useState<Partial<Program>>({});

  const daysOfTheWeek = useMemo(
    () => [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    [],
  );

  const renderDayOfTheWeek = ({ item }: { item: string }) => {
    return (
      <Card key={item} p="$2" m="$2" fd="column">
        <XStack jc="space-between" ai="center" p="$2">
          <Text>{item}</Text>
          <Button
            onPress={() => {
              navigation.navigate("CreateWorkoutListPage");
            }}
          >
            <Plus size="$1" />
          </Button>
        </XStack>

        <FlatList
          data={[]}
          renderItem={() => <Text>Exercises</Text>}
          renderHorizontal
        />
      </Card>
    );
  };

  return (
    <View f={1} space="$3" m="$4">
      <Input
        placeholder="Program Name"
        value={programDraft.name}
        onChangeText={(value: string) =>
          setProgramDraft({ ...programDraft, name: value })
        }
      />
      <FlatList data={daysOfTheWeek} renderItem={renderDayOfTheWeek} />
    </View>
  );
}
