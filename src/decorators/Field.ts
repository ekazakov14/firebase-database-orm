const Field = (options?: any) => (target: any, key: string) => {
  const {constructor} = target;
  const fields = Reflect.getMetadata('fields', constructor);
  const resultFields = fields ? [...fields, key] : [key];
  Reflect.defineMetadata('fields', resultFields, constructor);
};

export default Field;