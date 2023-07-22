import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import createSecureStorage from './secureStorage';
import appDataSlice from './appDataSlice';

const SecureStorage = createSecureStorage();

const securePersistConfig = {
  key: 'secure',
  storage: SecureStorage,
};

const workoutsPersistConfig = {
  key: 'workouts',
  storage: AsyncStorage
}

export const rootReducer = combineReducers({
  secure: persistReducer(securePersistConfig, appDataSlice),
  workouts: persistReducer(workoutsPersistConfig, appDataSlice)
});
