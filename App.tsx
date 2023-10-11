import "react-native-gesture-handler";

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
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { Linking, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/integration/react";
import { navigationStateChanged } from "./src/app/appDataSlice";
import { useAppDispatch, useAppSelector } from "./src/app/hooks";
import Progress from "./src/features/Progress";
import config from "./tamagui.config";

const persistor = persistStore(store);

export type RootTabsParamList = {
  Workout: undefined;
  Progress: undefined;
  Settings: undefined;
  HomePage: undefined;
  TrackWorkout: undefined;
  Programs: undefined;
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
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [fontsLoaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    Gerhaus: require("./assets/fonts/Gerhaus.ttf"),
    OpenSans: require("./assets/fonts/OpenSans-Regular.ttf"),
    OpenSansBold: require("./assets/fonts/OpenSans-Bold.ttf"),
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isNavReady, setIsNavReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const navigationStateStr = useAppSelector(
    (state) => state.appData.secure.navigationState,
  );

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

  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (initialUrl === null) {
          const state = navigationStateStr
            ? JSON.parse(navigationStateStr)
            : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsNavReady(true);
      }
    };

    if (!isNavReady) {
      restoreState();
    }
  }, [isNavReady]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && isNavReady) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isNavReady]);

  if (!fontsLoaded || !isNavReady) return null;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background.val,
      }}
      //@ts-expect-error onLayout is not defined in ViewProps
      onLayout={onLayoutRootView}
    >
      <NavigationContainer
        theme={NavigationTheme}
        initialState={initialState}
        onStateChange={(state) =>
          dispatch(navigationStateChanged(JSON.stringify(state)))
        }
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
