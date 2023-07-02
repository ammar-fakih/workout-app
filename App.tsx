import 'react-native-gesture-handler';

import { RootSiblingParent } from 'react-native-root-siblings';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import { store } from './src/app/store';

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <RootSiblingParent>
          <ApplicationProvider {...eva} theme={eva.light}>
            <View>
              <Text>Open up App.tsx to start working on your app!</Text>
              <StatusBar style="auto" />
            </View>
          </ApplicationProvider>
        </RootSiblingParent>
      </Provider>
    </NavigationContainer>
  );
}
