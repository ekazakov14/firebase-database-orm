import PropertiesOf from '../types/PropertiesOf';
import IQuery from './Query';

interface IModel<T> {
  createdAt: Date;
  updatedAt: Date;

  constructor(props: PropertiesOf<T>): void;

  getFields(): string[];
  getProps(): PropertiesOf<T>;
  getRouteName(): string;

  save(key?: string): Promise<string>;
}

export default IModel;