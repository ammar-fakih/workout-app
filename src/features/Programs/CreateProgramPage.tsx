import { useState } from "react";
import { Input, View } from "tamagui";
import { Program } from "../Home/types";

export default function CreateProgramPage() {
  const [programDraft, setProgramDraft] = useState<Partial<Program>>({});

  return (
    <View f={1} space="$3" m="$4">
      <Input
        placeholder="Program Name"
        value={programDraft.name}
        onChangeText={(value: string) =>
          setProgramDraft({ ...programDraft, name: value })
        }
      />
    </View>
  );
}
