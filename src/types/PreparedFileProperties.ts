type PreparedFileProperties<T> = {
  [key in keyof T]: T[key] extends File ? string : T[key];
};

export default PreparedFileProperties;
