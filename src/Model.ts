import 'reflect-metadata';
import PropertiesOf from './types/PropertiesOf';
import OnlyPropertiesKeysOf from './types/OnlyPropertiesKeysOf';
import { WRONG_PROPERTIES, EMPTY_FIELDS_MODEL } from './constants/error';
import { FIELDS_KEY } from './constants/model';

abstract class Model<T> {
  protected createdAt: Date;
  protected updatedAt: Date;
  public static routeName: string;
  protected self = Object.getPrototypeOf(this).constructor;
  private props = typeof this;

  constructor(props: PropertiesOf<T>) {
    const fields = this.self.getFields() as string[];

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

  public static getFields() {
    const props = typeof this;
    return Reflect.getMetadata(FIELDS_KEY, this) as Extract<(OnlyPropertiesKeysOf<typeof props>), string>[];
  }
}

export default Model;