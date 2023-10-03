import { useState } from "react";
import { Pause, Play } from "@tamagui/lucide-icons";
import { Button } from "tamagui";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  calculateStopWatchValue,
  getStopWatchStringFromSeconds,
} from "../features/Home/helperFunctions";
import {
  stopWatchPaused,
  stopWatchStarted,
} from "../features/Home/workoutsSlice";

export default function StopWatch() {
  const dispatch = useAppDispatch();
  const [stopWatchValue, setStopWatchValue] = useState(0);
  const [intervalID, setIntervalID] = useState<NodeJS.Timeout>();
  const stopWatchStartTime = useAppSelector(
    (state) => state.appData.workouts.stopWatchStartTime,
  );
  const stopWatchExtraTime = useAppSelector(
    (state) => state.appData.workouts.stopWatchExtraSeconds,
  );

  const handlePress = () => {
    if (intervalID) {
      clearInterval(intervalID);
      setIntervalID(undefined);
      dispatch(stopWatchPaused());
    } else {
      const intervalID = setInterval(() => {
        setStopWatchValue(
          calculateStopWatchValue(stopWatchStartTime!, stopWatchExtraTime),
        );
      }, 1000);
      setIntervalID(intervalID);
      dispatch(stopWatchStarted());
    }
  };

  return (
    <Button
      icon={stopWatchStartTime ? <Pause /> : <Play />}
      onPress={handlePress}
    >
      {getStopWatchStringFromSeconds(stopWatchValue)}
    </Button>
  );
}
