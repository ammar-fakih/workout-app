import { Pause, Play } from "@tamagui/lucide-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Text } from "tamagui";
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

    clearInterval(intervalID);
    setIntervalID(undefined);

    if (stopWatchStartTime) {
      const intervalID = setInterval(function () {
        intervalCallback.current();
      }, 1000);
      setIntervalID(intervalID);
    }

    return () => {
      clearInterval(intervalID);
      setIntervalID(undefined);
    };
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
      const intervalID = setInterval(function () {
        intervalCallback.current();
      }, 1000);
      setIntervalID(intervalID);
      dispatch(stopWatchStarted());
    }
  };

  return (
    <Button
      icon={stopWatchStartTime ? <Pause /> : <Play />}
      onPress={handlePress}
      variant="outlined"
      paddingVertical="$0"
    >
      <Text fontFamily="$spaceMono">{getStopWatchString(stopWatchValue)}</Text>
    </Button>
  );
}
