import 'reflect-metadata';
import PropertiesOf from './types/PropertiesOf';
import OnlyPropertiesKeysOf from './types/OnlyPropertiesKeysOf';
import { WRONG_PROPERTIES, EMPTY_FIELDS_MODEL } from './constants/error';
import { FIELDS_KEY } from './constants/model';
import FieldDescriptor from './types/FieldDescriptor';

abstract class Model<T> {
  protected createdAt: Date;
  protected updatedAt: Date;
  public static routeName: string;
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
    const fields = this.self.getFields();

    return fields.reduce((obj: any, current: Extract<(OnlyPropertiesKeysOf<T>), string>) => ({
      ...obj,
      [current]: this[current.toString()],
    }), {});
  }

  public static getFields(): FieldDescriptor[] {
    const props = typeof this;
    return Reflect.getMetadata(FIELDS_KEY, this) as FieldDescriptor[];
  }

  public static getFieldsKeys(): string[]|null {
    const fields = this.getFields();
    return fields ? fields.map((field) => field.key) : null;
  }
}

export default Model;