import { useCallback, useEffect, useRef, useState } from "react";
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
  const intervalCallback = useRef<() => void>(() => {});
  const [stopWatchValue, setStopWatchValue] = useState(0);
  const [intervalID, setIntervalID] = useState<NodeJS.Timeout>();
  const stopWatchStartTime = useAppSelector(
    (state) => state.appData.workouts.stopWatchStartTime,
  );
  const stopWatchExtraTime = useAppSelector(
    (state) => state.appData.workouts.stopWatchExtraSeconds,
  );

  useEffect(() => {
    setStopWatchValue(
      calculateStopWatchValue(stopWatchStartTime, stopWatchExtraTime),
    );

    if (!intervalID && stopWatchStartTime) {
      function tick() {
        intervalCallback.current();
      }
      const intervalID = setInterval(tick, 1000);
      setIntervalID(intervalID);
    }
  }, []);

  useEffect(() => {
    intervalCallback.current = () => {
      setStopWatchValue(
        calculateStopWatchValue(stopWatchStartTime, stopWatchExtraTime),
      );
    };
  }, [stopWatchStartTime, stopWatchExtraTime]);

  const getStopWatchString = useCallback(
    (stopWatchValue: number) => getStopWatchStringFromSeconds(stopWatchValue),
    [],
  );

  const handlePress = () => {
    if (intervalID) {
      clearInterval(intervalID);
      setIntervalID(undefined);
      dispatch(stopWatchPaused());
    } else {
      function tick() {
        intervalCallback.current();
      }
      const intervalID = setInterval(tick, 1000);
      setIntervalID(intervalID);
      dispatch(stopWatchStarted());
    }
  };

  return (
    <Button
      icon={stopWatchStartTime ? <Pause /> : <Play />}
      onPress={handlePress}
      variant="outlined"
      p="$0"
    >
      {getStopWatchString(stopWatchValue)}
    </Button>
  );
}
