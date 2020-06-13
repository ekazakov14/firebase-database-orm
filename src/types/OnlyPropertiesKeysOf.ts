type OnlyPropertiesKeysOf<T> = {
  [key in keyof T]: T[key] extends Function ? never : key;
}[keyof T];

export default OnlyPropertiesKeysOf;