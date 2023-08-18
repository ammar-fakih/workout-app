import * as SecureStore from "expo-secure-store";

export default function createSecureStorage() {
  const replaceCharacter = "_";
  const replacer = defaultReplacer;

  return {
    getItem: (key: string) =>
      SecureStore.getItemAsync(replacer(key, replaceCharacter)),
    setItem: (key: string, value: string) =>
      SecureStore.setItemAsync(replacer(key, replaceCharacter), value),
    removeItem: (key: string) =>
      SecureStore.deleteItemAsync(replacer(key, replaceCharacter)),
  };
}

function defaultReplacer(key: string, replaceCharacter: string) {
  return key.replace(/[^a-z0-9.\-_]/gi, replaceCharacter);
}
