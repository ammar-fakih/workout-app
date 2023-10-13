import { useFocusEffect } from "@react-navigation/native";
import { Pause, Play } from "@tamagui/lucide-icons";
import { useCallback, useRef, useState } from "react";
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

type Props = {
  isFocused: boolean;
};

export default function StopWatch({ isFocused }: Props) {
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

  useFocusEffect(
    useCallback(() => {
      // Set initial value so that the stop watch doesn't start at 0
      setStopWatchValue(
        calculateStopWatchValue(stopWatchStartTime, stopWatchExtraTime),
      );

      clearInterval(intervalID);
      setIntervalID(undefined);

      if (stopWatchStartTime) {
        intervalCallback.current = () => {
          setStopWatchValue(
            calculateStopWatchValue(stopWatchStartTime, stopWatchExtraTime),
          );
        };

        const intervalID = setInterval(function () {
          intervalCallback.current();
        }, 1000);
        setIntervalID(intervalID);
      }

      return () => {
        clearInterval(intervalID);
        setIntervalID(undefined);
      };
    }, [stopWatchStartTime, stopWatchExtraTime]),
  );

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
