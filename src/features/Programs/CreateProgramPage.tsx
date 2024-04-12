import { Input, View } from "tamagui";

export default function CreateProgramPage() {
  return (
    <View f={1} space="$3" m="$4">
      <Input placeholder="Program Name" />
      <Input placeholder="" />
    </View>
  );
}
