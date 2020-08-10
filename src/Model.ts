import 'reflect-metadata';
import PropertiesOf from '@type/PropertiesOf';
import OnlyPropertiesKeysOf from '@type/OnlyPropertiesKeysOf';
import FieldDescriptor from '@type/FieldDescriptor';
import { WRONG_PROPERTIES, EMPTY_FIELDS_MODEL } from '@constants/error';
import { FIELDS_KEY } from '@constants/model';

abstract class Model<T> {
  public static routeName: string;

  public static timestamps: boolean = true;

  protected self = Object.getPrototypeOf(this).constructor;

  constructor(props: PropertiesOf<T>) {
    const fields = this.self.getFieldsKeys() as string[];

    if (fields) {
      Object.keys(props).forEach((key) => {
        if (!fields.includes(key)) {
          throw new Error(WRONG_PROPERTIES);
        }

        this[key] = props[key];
      });
    } else {
      throw new Error(EMPTY_FIELDS_MODEL);
    }
  }

  public getProps(): PropertiesOf<T> {
    const fields = this.self.getFieldsKeys();

    return fields.reduce((obj: any, current: Extract<(OnlyPropertiesKeysOf<T>), string>) => ({
      ...obj,
      [current]: this[current.toString()],
    }), {});
  }

  public static getFields(
    filter: Partial<FieldDescriptor> = {},
  ): FieldDescriptor[] {
    const fields = Reflect.getMetadata(FIELDS_KEY, this) as FieldDescriptor[];

    return Object.keys(filter).reduce((resultFields: FieldDescriptor[], key) => resultFields.filter((field) => field[key] === filter[key]), fields);
  }

  public static getFieldsKeys(): string[]|null {
    const fields = this.getFields();
    return fields ? fields.map((field) => field.key) : null;
  }
}

export default Model;
