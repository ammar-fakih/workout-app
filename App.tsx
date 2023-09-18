import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider } from "react-redux";
import { TamaguiProvider } from "tamagui";

import config from "./tamagui.config";

import { store } from "./src/app/store";
import Calendar from "./src/features/Calendar";
import Home from "./src/features/Home";

const Stack = createStackNavigator();

export default function () {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <RootSiblingParent>
          <TamaguiProvider config={config}>
            <App />
          </TamaguiProvider>
        </RootSiblingParent>
      </Provider>
    </NavigationContainer>
  );
}

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Calendar" component={Calendar} />
    </Stack.Navigator>
  );
}
