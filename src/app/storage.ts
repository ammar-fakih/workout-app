import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

import appDataSlice from "./appDataSlice";
import createSecureStorage from "./secureStorage";
import workoutsSlice from "../features/Home/workoutsSlice";

const SecureStorage = createSecureStorage();

const securePersistConfig = {
  key: "secure",
  storage: SecureStorage,
};

const workoutsPersistConfig = {
  key: "workouts",
  storage: AsyncStorage,
};

export const rootReducer = combineReducers({
  secure: persistReducer(securePersistConfig, appDataSlice),
  workouts: persistReducer(workoutsPersistConfig, workoutsSlice),
});
