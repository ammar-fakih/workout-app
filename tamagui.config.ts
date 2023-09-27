import { config, createGenericFont } from "@tamagui/config";
import { color, radius, size, space, themes, zIndex } from "@tamagui/themes";
import { createTamagui, createTokens } from "tamagui";

// const gerhaus = createFont({
//   family: "Gerhaus, Arial, sans-serif",
//   size: {
//     1: 12,
//     2: 14,
//     3: 15,
//     5: 20,
//   },
//   lineHeight: {
//     2: 22,
//   },
//   weight: {
//     1: "300",
//     3: "600",
//   },
//   letterSpacing: {
//     1: 0,
//     2: -1,
//   },
//   // (native) swap out fonts by face/style
//   face: {
//     300: { normal: "Gerhaus", italic: "GerhausItalic" },
//   },
// });

const gerhaus = createGenericFont("Gerhaus");

const tokens = createTokens({
  size,
  space,
  zIndex,
  color,
  radius,
});

const tamaguiConfig = createTamagui({
  ...config,
  themes: {
    ...themes,
    light_green: { ...themes.light_green, background: "#fff" },
    dark_blue: { ...themes.dark_blue, background: "#000" },
  },
  tokens,
  fonts: { ...config.fonts, gerhaus },
});
// this makes typescript properly type everything based on the config

type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
export default tamaguiConfig;
// depending on if you chose tamagui, @tamagui/core, or @tamagui/web

// be sure the import and declare module lines both use that same name
