import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider } from "react-redux";
import { TamaguiProvider, View, useTheme } from "tamagui";

import { store } from "./src/app/store";
import Calendar from "./src/features/Calendar";
import Home from "./src/features/Home";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import { useCallback } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
      <NavigationContainer>
        <Provider store={store}>
          <RootSiblingParent>
            <TamaguiProvider config={config} defaultTheme="dark">
              <App />
            </TamaguiProvider>
          </RootSiblingParent>
        </Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function App() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

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
        paddingTop: insets.top,
      }}
      //@ts-expect-error onLayout is not defined in ViewProps
      onLayout={onLayoutRootView}
    >
      <Tabs.Navigator>
        <Tabs.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Tabs.Screen name="History" component={Calendar} />
        <Tabs.Screen name="Settings" component={Settings} />
      </Tabs.Navigator>
    </View>
  );
}
