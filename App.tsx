import "react-native-gesture-handler";

import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider } from "react-redux";
import { TamaguiProvider, Theme, View, useTheme } from "tamagui";

import { store } from "./src/app/store";
import Calendar from "./src/features/Calendar";
import Home from "./src/features/Home";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Settings from "./src/features/Settings/Settings";
import config from "./tamagui.config";

export type RootStackParamList = {
  Home: undefined;
  History: undefined;
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

      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

function App() {
  const theme = useTheme();
  const [fontsLoaded] = useFonts({
    // Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    // InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  const BottomBarTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.placeholderColor.val,
      primary: theme.color.val,
      card: theme.placeholderColor.val,
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
      <NavigationContainer>
        <Tabs.Navigator>
          <Tabs.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Tabs.Screen name="History" component={Calendar} />
          <Tabs.Screen name="Settings" component={Settings} />
        </Tabs.Navigator>
      </NavigationContainer>
    </View>
  );
}
