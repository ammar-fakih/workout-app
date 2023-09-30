import { View } from "tamagui";
import { Calendar as RNC } from "react-native-calendars";

export default function Calendar() {
  return (
    <View f={1} m="$2" theme="dark">
      <RNC />
    </View>
  );
}
