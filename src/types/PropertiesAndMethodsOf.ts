type PropertiesAndMethodsOf<T> = {
  [key in keyof T]: T[key] extends Function ? never : T[key];
};

export default PropertiesAndMethodsOf;