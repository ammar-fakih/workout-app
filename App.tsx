import "react-native-gesture-handler";

import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider } from "react-redux";
import { TamaguiProvider, Theme, View, useTheme } from "tamagui";

import { store } from "./src/app/store";
import Home from "./src/features/Home";
import Calendar from "./src/features/Progress/ProgressPage";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Settings as SettingsIcon } from "@tamagui/lucide-icons";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { Platform, UIManager } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import config from "./tamagui.config";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export type RootTabsParamList = {
  Workout: undefined;
  Progress: undefined;
  Settings: undefined;
  HomePage: undefined;
  TrackWorkout: undefined;
};
const Tabs = createBottomTabNavigator<RootTabsParamList>();

export default function () {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootSiblingParent>
          <TamaguiProvider config={config} defaultTheme="light_green">
            <Theme name="dark_blue">
              <App />
            </Theme>
          </TamaguiProvider>
        </RootSiblingParent>
      </Provider>

      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

function App() {
  const theme = useTheme();
  const [fontsLoaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    Gerhaus: require("./assets/fonts/Gerhaus.ttf"),
    OpenSans: require("./assets/fonts/OpenSans-Regular.ttf"),
    OpenSansBold: require("./assets/fonts/OpenSans-Bold.ttf"),
  });

  const NavigationTheme = {
    dark: true,
    colors: {
      primary: theme.color.val,
      background: theme.background.val,
      card: theme.color3.val,
      text: theme.color.val,
      border: theme.color2.val,
      notification: "rgb(255, 59, 48)",
    },
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background.val,
      }}
      //@ts-expect-error onLayout is not defined in ViewProps
      onLayout={onLayoutRootView}
    >
      <NavigationContainer theme={NavigationTheme}>
        <Tabs.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              let icon;

              if (route.name === "Workout") {
                icon = (
                  <MaterialCommunityIcons
                    name="weight-lifter"
                    size={size}
                    color={color}
                  />
                );
              } else if (route.name === "Progress") {
                icon = <Octicons name="graph" size={size} color={color} />;
              } else if (route.name === "Settings") {
                icon = <SettingsIcon size={size} color={color} />;
              }

              return icon;
            },
          })}
        >
          <Tabs.Screen name="Workout" component={Home} />
          <Tabs.Screen name="Progress" component={Calendar} />
        </Tabs.Navigator>
      </NavigationContainer>
    </View>
  );
}
