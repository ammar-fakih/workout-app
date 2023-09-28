import { config, createGenericFont } from "@tamagui/config";
import { color, radius, size, space, themes, zIndex } from "@tamagui/themes";
import { createTamagui, createTokens } from "tamagui";

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
    light_blue: { ...themes.light_blue, background: "#fff" },
    dark_blue: { ...themes.dark_blue, background: "#000" },
    dark_red: { ...themes.dark_red, background: "#000" },
  },
  tokens,
  fonts: { ...config.fonts, gerhaus },
});

type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
export default tamaguiConfig;
