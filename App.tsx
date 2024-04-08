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
};
const Tabs = createBottomTabNavigator<RootTabsParamList>();

export default function () {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RootSiblingParent>
            <TamaguiProvider config={config} defaultTheme="dark_blue">
              <Theme name={colorScheme === "dark" ? "dark_blue" : "light_blue"}>
                {/* <Theme name="dark_blue"> */}
                <App />
              </Theme>
            </TamaguiProvider>
          </RootSiblingParent>
        </PersistGate>
      </Provider>

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaProvider>
  );
}

function App() {
  const theme = useTheme();
  const [appIsReady, setAppIsReady] = useState(false);

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
          <Tabs.Screen name="Progress" component={Progress} />
        </Tabs.Navigator>
      </NavigationContainer>
    </View>
  );
}
