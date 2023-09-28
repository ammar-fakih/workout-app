import { Flame, X } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { Animated } from "react-native";
import { Text, View, XStack } from "tamagui";

export default function StreakMessage() {
  const [isVisible, setIsVisible] = useState(true);
  const [streakFireOpacity] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(streakFireOpacity, {
          toValue: 0.6,
          duration: 2000,
          easing: (x) => Math.sin(x * Math.PI),
          useNativeDriver: true,
        }),
        Animated.timing(streakFireOpacity, {
          toValue: 1,
          duration: 2000,
          easing: (x) => Math.sin(x * Math.PI),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  let content = null;
  if (isVisible) {
    content = (
      <XStack width="100%" jc="center">
        <View ai="center">
          <Flame size="$10" color="blue" />
          <Text fontSize="$8">5 Day Streak</Text>
          <Text>Keep it up!</Text>
        </View>

        <View onPress={() => setIsVisible(false)}>
          <X size="$2" />
        </View>
      </XStack>
    );
  }

  return <>{content}</>;
}
