import PropertiesOf from './PropertiesOf';

type PreparedFileProperties<T> = {
  [key in keyof PropertiesOf<T>]: T[key] extends File ? string : T[key];
} | PropertiesOf<T>;

export default PreparedFileProperties;
