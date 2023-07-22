import 'react-native-gesture-handler';

import { RootSiblingParent } from 'react-native-root-siblings';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { NativeBaseProvider } from 'native-base';

import { store } from './src/app/store';
import Home from './src/features/Home';
import { createStackNavigator } from '@react-navigation/stack';
import Calendar from './src/features/Calendar';

const Stack = createStackNavigator();

export default function () {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <RootSiblingParent>
          <NativeBaseProvider>
            <App />
          </NativeBaseProvider>
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
