import "react-native-gesture-handler";

import React from "react";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider } from "react-redux";
import { TamaguiProvider, Theme, View, useTheme } from "tamagui";

import { store } from "./src/app/store";
import Home from "./src/features/Home";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Settings as SettingsIcon } from "@tamagui/lucide-icons";
import { loadAsync } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/integration/react";
import Progress from "./src/features/Progress";
import config from "./tamagui.config";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppSelector } from "./src/app/hooks";
import Settings from "./src/features/Settings/Settings";

const PERSISTENCE_KEY = "NAVIGATION_STATE_V1";

const persistor = persistStore(store);

SplashScreen.preventAutoHideAsync();

export type RootTabsParamList = {
  Workout: undefined;
  Progress: undefined;
  Settings: undefined;
  HomePage: undefined;
  TrackWorkout: undefined;
  Programs: undefined;
  CreateProgramPage: undefined;
  ProgramsPage: undefined;
  CreateWorkoutListPage: undefined;
  WorkoutRecordPage: { date: string };
  LogPastWorkoutPage: undefined;
};
const Tabs = createBottomTabNavigator<RootTabsParamList>();

export default function () {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RootSiblingParent>
            <TamaguiProvider config={config} defaultTheme="dark_blue">
              <AppWithTheme />
            </TamaguiProvider>
          </RootSiblingParent>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

function AppWithTheme() {
  const deviceColorScheme = useColorScheme();
  const themeMode = useAppSelector(
    (state) => state.appData.secure.themeMode || "system",
  );

  // Determine which theme to use based on settings
  const activeColorScheme =
    themeMode === "system" ? deviceColorScheme : themeMode;

  const themeName = activeColorScheme === "dark" ? "dark_blue" : "light_blue";

  return (
    <>
      <Theme name={themeName}>
        <App />
      </Theme>
      <StatusBar style={activeColorScheme === "dark" ? "light" : "dark"} />
    </>
  );
}

function App() {
  const theme = useTheme();
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialState, setInitialState] = useState();

  const NavigationTheme = useMemo(
    () => ({
      dark: true,
      colors: {
        primary: theme.color.val,
        background: theme.background.val,
        card: theme.color3.val,
        text: theme.color.val,
        border: theme.color2.val,
        notification: "rgb(255, 59, 48)",
      },
    }),
    [theme],
  );

  useEffect(() => {
    const prepare = async () => {
      try {
        await loadAsync({
          Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
          InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
          Gerhaus: require("./assets/fonts/Gerhaus.ttf"),
          OpenSans: require("./assets/fonts/OpenSans-Regular.ttf"),
          OpenSansBold: require("./assets/fonts/OpenSans-Bold.ttf"),
          SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
        });

        const initialUrl = await Linking.getInitialURL();
        console.log("initialUrl", initialUrl);

        if (initialUrl == null) {
          // Only restore state if there's no deep link
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined;

          console.log("state", state);

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } catch (e) {
        console.warn("Error while preparing app", e);
      } finally {
        setAppIsReady(true);
      }
    };
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background.val,
      }}
      onLayout={onLayoutRootView}
    >
      <NavigationContainer
        theme={NavigationTheme}
        initialState={initialState}
        onStateChange={(state) => {
          AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
        }}
      >
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
          <Tabs.Screen name="Progress" component={Progress} />
        </Tabs.Navigator>
      </NavigationContainer>
    </View>
  );
}
