import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import createSecureStorage from './secureStorage';
import appDataSlice from './appDataSlice';

const SecureStorage = createSecureStorage();

const securePersistConfig = {
  key: 'secure',
  storage: SecureStorage,
  whitelist: ['loginKey', 'darkMode'],
};

export const rootReducer = combineReducers({
  secure: persistReducer(securePersistConfig, appDataSlice),
});
