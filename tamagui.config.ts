import { config } from "@tamagui/config";
import { color, radius, size, space, themes, zIndex } from "@tamagui/themes";
import { createTamagui, createTokens } from "tamagui";
const tokens = createTokens({
  size,
  space,
  zIndex,
  color,
  radius,
});
const tamaguiConfig = createTamagui({ ...config, themes, tokens });
// this makes typescript properly type everything based on the config

type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
export default tamaguiConfig;
// depending on if you chose tamagui, @tamagui/core, or @tamagui/web

// be sure the import and declare module lines both use that same name
