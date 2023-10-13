import { AlertDialog, Button, XStack, YStack } from "tamagui";

type Option = {
  label: string;
  onPress?: () => void;
  cancel?: boolean;
};

type Props = {
  triggerOnPress: () => void;
  trigger: React.ReactNode;
  title: string;
  description: string;
  options: Option[];
};

export default function AlertDialogContainer({
  triggerOnPress,
  trigger,
  title,
  description,
  options,
}: Props) {
  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          // opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          jc="center"
          ai="center"
        >
          <AlertDialog.Content
            bordered
            elevate
            key="content"
            animation={[
              "quick",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
            backgroundColor="$background"
          >
            <YStack space>
              <AlertDialog.Title>{title}</AlertDialog.Title>
              <AlertDialog.Description>{description}</AlertDialog.Description>

              <XStack space="$3" justifyContent="flex-end">
                {options.map((option) =>
                  option.cancel ? (
                    <AlertDialog.Cancel asChild key={option.label}>
                      <Button>{option.label}</Button>
                    </AlertDialog.Cancel>
                  ) : (
                    <AlertDialog.Action asChild key={option.label}>
                      <Button onPress={option.onPress} theme="active">
                        {option.label}
                      </Button>
                    </AlertDialog.Action>
                  ),
                )}
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Overlay>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
