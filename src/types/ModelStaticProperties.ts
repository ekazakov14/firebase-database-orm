import FieldDescriptor from '@type/FieldDescriptor';

type ModelStaticProperties = {
  routeName: string,
  timestamps: boolean,
  getFields(filter?): FieldDescriptor[],
  getFieldsKeys(): string[]|null,
};

export default ModelStaticProperties;
