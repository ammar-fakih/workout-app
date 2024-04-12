import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CheckCheck, Info, X } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import {
  Adapt,
  Button,
  Dialog,
  Fieldset,
  Input,
  Label,
  Popover,
  Sheet,
  Text,
  Unspaced,
  XStack,
} from "tamagui";
import { showToast } from "../../app/functions";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUnitAbbreviation } from "./helperFunctions";
import {
  selectBodyWeightRecordByID,
  todayBodyWeightRecordAdded as todaysBodyWeightRecordAdded,
  todaysBodyWeightRecordCleared,
} from "./workoutsSlice";

export default function LogBodyWeight() {
  const today = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const [weight, setWeight] = useState<string>("");
  const units = useAppSelector((state) => state.appData.workouts.units);
  const todaysBodyWeight = useAppSelector((state) =>
    selectBodyWeightRecordByID(state, today),
  );

  useEffect(() => {
    if (todaysBodyWeight) {
      setWeight(todaysBodyWeight.weight.toString());
    }
  }, [todaysBodyWeight]);

  const handleSubmit = () => {
    if (today && weight) {
      dispatch(
        todaysBodyWeightRecordAdded({
          weight: parseInt(weight, 10),
          date: today,
        }),
      );
      showToast("Body weight logged", "green");
    }
  };

  const handleClear = () => {
    if (today) {
      dispatch(todaysBodyWeightRecordCleared(today));
      setWeight("");
    }
  };

  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button
          icon={
            <XStack ai="center">
              <MaterialCommunityIcons
                name="scale-bathroom"
                p="$3"
                size={24}
                color={colorScheme === "dark" ? "#fff" : "#000"}
              />
              {todaysBodyWeight ? <CheckCheck color="$green10" /> : null}
            </XStack>
          }
          variant="outlined"
        />
      </Dialog.Trigger>

      <Adapt when="sm">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            animation="quick"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
          animation={[
            "quicker",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
        >
          <Dialog.Title>Log Body Weight</Dialog.Title>
          <Dialog.Description>
            Log your body weight for today ({today ? today.split("T")[0] : ""})
          </Dialog.Description>
          <Fieldset gap="$4" horizontal>
            <Label width={160} justifyContent="flex-end" htmlFor="name">
              Weight ({getUnitAbbreviation(units)}) <PopOver />
            </Label>
            <Input
              autoFocus
              flex={1}
              inputMode="numeric"
              value={String(weight)}
              onChangeText={setWeight}
            />
          </Fieldset>

          <XStack alignSelf="flex-end" gap="$4">
            {todaysBodyWeight ? (
              <Dialog.Close displayWhenAdapted asChild>
                <Button theme="red" onPress={handleClear}>
                  <Text>Clear Entry</Text>
                </Button>
              </Dialog.Close>
            ) : null}
            <Dialog.Close displayWhenAdapted asChild>
              <Button theme="active" onPress={handleSubmit}>
                Save changes
              </Button>
            </Dialog.Close>
          </XStack>

          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

function PopOver() {
  return (
    <Popover>
      <Popover.Trigger pr="$4">
        <Info size="$1" />
      </Popover.Trigger>

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          "quick",
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Text>You can change the units in the settings.</Text>
      </Popover.Content>
    </Popover>
  );
}
