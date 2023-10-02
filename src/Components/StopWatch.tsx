import { Pause, Play } from "@tamagui/lucide-icons";
import { Button } from "tamagui";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getStopWatchStringFromSeconds } from "../features/Home/helperFunctions";

export default function StopWatch() {
  const dispatch = useAppDispatch();
  const nodeTimeout = useAppSelector(
    (state) => state.appData.workouts.nodeTimeout,
  );
  const stopWatchValue = useAppSelector(
    (state) => state.appData.workouts.stopWatchValue,
  );
  
  const handlePress = () => {
    if (nodeTimeout) {
      
    }
  }

  return (
    <Button icon={nodeTimeout ? <Pause /> : <Play />}>
      {getStopWatchStringFromSeconds(stopWatchValue)}
    </Button>
  );
}
