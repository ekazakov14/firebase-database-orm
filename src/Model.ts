import 'reflect-metadata';
import PropertiesOf from './types/PropertiesOf';
import OnlyPropertiesKeysOf from './types/OnlyPropertiesKeysOf';
import { WRONG_PROPERTIES, EMPTY_FIELDS_MODEL } from './constants/error';
import { FIELDS_KEY } from './constants/model';

abstract class Model<T> {
  protected createdAt: Date;
  protected updatedAt: Date;
  protected routeName = undefined;

  constructor(props: PropertiesOf<T>) {
    const fields = this.getFields() as string[];

    if (fields) {
      Object.keys(props).forEach((key) => {
        if ( !fields.includes(key) ) {
          throw new Error(WRONG_PROPERTIES);
        }

        this[key] = props[key];
      });
    } else {
      throw new Error(EMPTY_FIELDS_MODEL);
    }
  }

  public getFields(): Extract<(OnlyPropertiesKeysOf<T>), string>[] {
    return Reflect.getMetadata(FIELDS_KEY, this.constructor);
  }

  public getProps(): PropertiesOf<T> {
    const fields = this.getFields();

    return fields.reduce((obj: any, current: Extract<(OnlyPropertiesKeysOf<T>), string>) => ({
      ...obj,
      [current]: this[current.toString()],
    }), {});
  }

  public getRouteName(): string {
    return this.routeName ?? `${this.constructor.name.toLocaleLowerCase()}s`;
  }
}

export default Model;