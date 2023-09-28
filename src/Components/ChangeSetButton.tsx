import { AnimatePresence, Button, styled } from "tamagui";

type Props = {
  onPress: () => void;
  text: string;
};
export default function ChangeSetButton({ onPress, text }: Props) {
  const AnimatableButton = styled(Button, {
    variants: {
      fromTop: {
        true: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        },
      },
      fromBottom: {
        true: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
      },
    },
  });
  return (
    <AnimatePresence enterVariant="fromTop" exitVariant="fromBottom">
      <AnimatableButton
        onPress={onPress}
        exitStyle={{ opacity: 0 }}
        animation="quick"
      >
        {text}
      </AnimatableButton>
    </AnimatePresence>
  );
}
