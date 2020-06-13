const Field = (options?: any) => (target: any, key: string) => {
  const {constructor} = target;
  const fields = constructor.prototype.getFields();
  const resultFields = fields ? [...fields, key] : [key];
  Reflect.defineMetadata('fields', resultFields, constructor);
};

export default Field;