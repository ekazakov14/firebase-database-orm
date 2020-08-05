import FieldDescriptor from '../types/FieldDescriptor';
import FieldOptions from '../types/FieldOptions';

const Field = (options: FieldOptions = {}) => (target: any, key: string): void => {
  const { constructor } = target;

  const fields = Reflect.getMetadata('fields', constructor);
  const descriptor: FieldDescriptor = {
    key,
    dbKey: options.dbKey ?? key,
  };
  const resultFields = fields ? [...fields, descriptor] : [descriptor];

  Reflect.defineMetadata('fields', resultFields, constructor);
};

export default Field;
