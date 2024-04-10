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
    // Set initial value so that the stop watch doesn't start at 0
    setStopWatchValue(
      calculateStopWatchValue(stopWatchStartTime, stopWatchExtraTime),
    );

    clearInterval(intervalID);

    if (stopWatchStartTime) {
      intervalCallback.current = () => {
        setStopWatchValue(
          calculateStopWatchValue(stopWatchStartTime, stopWatchExtraTime),
        );
      };

      const intervalID = setInterval(() => {
        setStopWatchValue(
          calculateStopWatchValue(stopWatchStartTime, stopWatchExtraTime),
        );
      }, 1000);
      setIntervalID(intervalID);
    }

    return () => {
      clearInterval(intervalID);
    };
  }, [stopWatchStartTime, stopWatchExtraTime]);

  const getStopWatchString = useCallback(
    (stopWatchValue: number) => getStopWatchStringFromSeconds(stopWatchValue),
    [],
  );

  const handlePress = () => {
    if (stopWatchStartTime) {
      clearInterval(intervalID);
      setIntervalID(undefined);
      dispatch(stopWatchPaused());
    } else {
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
