import "react-native-gesture-handler";

import { Octicons } from "@expo/vector-icons";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider } from "react-redux";
import { TamaguiProvider, Theme, View, useTheme } from "tamagui";

import { store } from "./src/app/store";
import Calendar from "./src/features/Calendar/Calendar";
import Home from "./src/features/Home";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Armchair, Settings as SettingsIcon } from "@tamagui/lucide-icons";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Settings from "./src/features/Settings/Settings";
import config from "./tamagui.config";

export type RootStackParamList = {
  Workout: undefined;
  Progress: undefined;
  Settings: undefined;
  HomePage: undefined;
  TrackWorkout: undefined;
};
const Tabs = createBottomTabNavigator<RootStackParamList>();

export default function () {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootSiblingParent>
          <TamaguiProvider config={config} defaultTheme="dark_purple">
            <Theme name="light">
              <App />
            </Theme>
          </TamaguiProvider>
        </RootSiblingParent>
      </Provider>

      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

function App() {
  const theme = useTheme();
  const [fontsLoaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  const NavigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
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
                icon = <Armchair size={size} color={color} />;
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
          <Tabs.Screen name="Settings" component={Settings} />
        </Tabs.Navigator>
      </NavigationContainer>
    </View>
  );
}
