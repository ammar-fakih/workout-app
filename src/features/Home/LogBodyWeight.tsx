import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CheckCheck, Info, X } from "@tamagui/lucide-icons";
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
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUnitAbbreviation } from "./helperFunctions";
import {
  bodyWeightRecordAdded,
  bodyWeightRecordSelectors,
} from "./workoutsSlice";
import { useState } from "react";
import { store } from "../../app/store";

export default function LogBodyWeight() {
  // const today = new Date();
  // today.setHours(0, 0, 0, 0);

  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const [weight, setWeight] = useState(0);
  const units = useAppSelector((state) => state.appData.workouts.units);
  const todaysBodyWeight = bodyWeightRecordSelectors.selectById(
    store.getState(),
    today.toISOString(),
  );

  console.log(todaysBodyWeight);

  const submitHandler = () => {
    dispatch(bodyWeightRecordAdded({ weight, date: today.toISOString() }));
  };

  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button
          p="$0"
          icon={
            <XStack ai="center">
              <MaterialCommunityIcons
                name="scale-bathroom"
                size={24}
                color={colorScheme === "dark" ? "#fff" : "#000"}
              />
              <CheckCheck color="$green10" />
            </XStack>
          }
          variant="outlined"
        />
      </Dialog.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet animation="150ms" zIndex={200000} modal dismissOnSnapToBottom>
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
            Log your body weight for today ({today})
          </Dialog.Description>
          <Fieldset gap="$4" horizontal>
            <Label width={160} justifyContent="flex-end" htmlFor="name">
              Weight ({getUnitAbbreviation(units)}) <PopOver />
            </Label>
            <Input
              flex={1}
              inputMode="numeric"
              value={String(weight)}
              onChangeText={setWeight}
            />
          </Fieldset>

          <XStack alignSelf="flex-end" gap="$4">
            <Dialog.Close displayWhenAdapted asChild>
              <Button theme="active" aria-label="Close" onPress={submitHandler}>
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
        zIndex={2000000}
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
