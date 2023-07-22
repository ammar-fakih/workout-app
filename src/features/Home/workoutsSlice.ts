import { createSlice } from '@reduxjs/toolkit';

interface WorkoutsState {
  workouts: Workout[][];
  units: Units;
}

const initialState: WorkoutsState = {
  workouts: [],
  units: Units.IMPERIAL,
};

export const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {},
});

export const {} = workoutsSlice.actions;

export default workoutsSlice.reducer;
