import * as SecureStore from 'expo-secure-store';

export default function createSecureStorage(options: any = {}) {
  const replaceCharacter = options.replaceCharacter || '_';
  const replacer = options.replacer || defaultReplacer;

  return {
    getItem: (key: string) =>
      SecureStore.getItemAsync(replacer(key, replaceCharacter), options),
    setItem: (key: string, value: string) =>
      SecureStore.setItemAsync(replacer(key, replaceCharacter), value, options),
    removeItem: (key: string) =>
      SecureStore.deleteItemAsync(replacer(key, replaceCharacter), options),
  };
}

function defaultReplacer(key: string, replaceCharacter: string) {
  return key.replace(/[^a-z0-9.\-_]/gi, replaceCharacter);
}
