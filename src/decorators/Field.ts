import 'reflect-metadata';
import FieldDescriptor from '../types/FieldDescriptor';
import FieldOptions from '../types/FieldOptions';

const defaultOptions: FieldOptions = {
  type: 'value',
};

const Field = ({ type, dbKey }: FieldOptions = defaultOptions) => (target: Object, key: string): void => {
  const { constructor } = target;

  const fields = Reflect.getMetadata('fields', constructor);
  const descriptor: FieldDescriptor = {
    type: type || 'value',
    key,
    dbKey: dbKey ?? key,
  };
  const resultFields = fields ? [...fields, descriptor] : [descriptor];

  Reflect.defineMetadata('fields', resultFields, constructor);
};

export default Field;
