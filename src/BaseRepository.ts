import firebase from 'firebase';
import ProcessedProperties from '@type/ProcessedProperties';
import PreparedProperties from '@root/types/PreparedProperties';
import ConstructorOf from '@root/types/ConstructorOf';
import Model from '@root/Model';
import UnixTimestamps from '@type/UnixTimestamps';
import ModelStaticProperties from '@type/ModelStaticProperties';
import PropertiesOf from '@type/PropertiesOf';
import DateTimestamps from '@type/DateTimestamps';
import FileModel from '@root/File';
import ResponseProperties from '@type/ResponseProperties';

class BaseRepository<T extends Model<T>> {
  public constructor(protected modelConstructor: ConstructorOf<T, ModelStaticProperties>) {
  }

  public getRoute(additional?: string): string {
    const baseRoute = this.modelConstructor.routeName ?? `${this.modelConstructor.name.toLocaleLowerCase()}s`;
    return additional ? `${baseRoute}/${additional}` : baseRoute;
  }

  public async getAll(): Promise<ResponseProperties<T>[] | []> {
    const response = await firebase.database().ref(this.getRoute()).once('value');
    let value = await response.val();
    value = value ? Object.values(value) : [];

    const processPromises = value.map((props: PropertiesOf<T>) => this.getProcessedProps(props));
    return Promise.all(processPromises);
  }

  public async get(key: string): Promise<ResponseProperties<T> | null> {
    const response = await firebase.database().ref(`${this.getRoute()}/${key}`).once('value');
    const value = response.val() as PropertiesOf<T>;

    return value ? this.getProcessedProps(value) : null;
  }

  public save(entity: T, key?: string): Promise<string> {
    return key ? this.set(entity, key) : this.push(entity);
  }

  public async find(condition: Partial<PreparedProperties<T>>): Promise<ResponseProperties<T>[] | null> {
    const firstKey = Object.keys(condition)[0];
    const snapshot = await
    firebase.database()
      .ref(this.getRoute())
      .orderByChild(firstKey)
      .equalTo(condition[firstKey])
      .once('value');

    const value = snapshot.val();
    const items = value ? Object.values(value) as PropertiesOf<T>[] : null;

    if (items) {
      const promises = items.map((props) => this.getProcessedProps(props));
      return Promise.all(promises);
    }

    return null;
  }

  public async remove(key: string): Promise<any> {
    return firebase.database().ref(this.getRoute(key)).remove();
  }

  protected async push(entity: T): Promise<string> {
    const currentTimestamp = +new Date();
    const props = await this.getPreparedProps(entity.getProps(), currentTimestamp);

    const response = await firebase.database().ref(this.getRoute()).push(props);
    return response.key;
  }

  protected async set(entity: T, key: string): Promise<string> {
    const existingValue = await this.get(key);
    let props: PropertiesOf<T> = entity.getProps();

    if (existingValue) {
      props = await this.getPreparedProps<T>(props, +existingValue.createdAt);
    }

    await firebase.database().ref(`${this.getRoute()}/${key}`).set(props);
    return key;
  }

  public async update(key: string, props: Partial<PreparedProperties<T>>): Promise<string> {
    await firebase.database().ref(this.getRoute(key)).update(props);
    return key;
  }

  protected async getPreparedProps<P extends object>(
    data: PropertiesOf<P>,
    createdAt?: number,
  ): Promise<PreparedProperties<P>> {
    let preparedData: PreparedProperties<P> = data;

    if (this.modelConstructor.timestamps) {
      const timestamps = this.getTimestamps(createdAt);

      preparedData = {
        ...preparedData,
        ...timestamps,
      };
    }

    return this.prepareFiles<PropertiesOf<P>>(preparedData);
  }

  protected async prepareFiles<P extends object>(props: P): Promise<P> {
    const resultProps: P = props;
    const filePromises: Promise<string>[] = [];

    const fileFields = this.modelConstructor.getFields({ type: 'file' });
    fileFields.forEach((fieldMeta) => {
      const { key } = fieldMeta;
      const fileModel = props[key] as FileModel;
      const promise = fileModel
        .upload()
        .then((fileKey) => {
          resultProps[key] = fileKey;
          return fileKey;
        });
      filePromises.push(promise);
    });

    await Promise.all(filePromises);
    return resultProps;
  }

  protected getProcessedProps = async <P extends object>(props: P): Promise<ProcessedProperties<P>> => {
    let processedProps: P|ProcessedProperties<P> = props;

    if (this.modelConstructor.timestamps) {
      processedProps = this.parseTimestamps<P>(processedProps);
    }

    return this.processFiles(processedProps);
  };

  protected async processFiles<P extends object>(props: P): Promise<ProcessedProperties<P>> {
    const resultProps = props;

    const fileFields = this.modelConstructor.getFields({ type: 'file' });
    fileFields.forEach((fieldMeta) => {
      const { key } = fieldMeta;
      resultProps[key] = new FileModel(resultProps[key]);
    });

    return resultProps as ProcessedProperties<P>;
  }

  protected getTimestamps = (createdAt?: number): UnixTimestamps => {
    const currentTimestamp = +new Date();

    return {
      createdAt: createdAt || currentTimestamp,
      updatedAt: currentTimestamp,
    };
  };

  protected parseTimestamps = <P extends UnixTimestamps>(props: P): P & DateTimestamps => {
    const { createdAt, updatedAt } = props;

    return {
      ...props,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
    };
  };
}

export default BaseRepository;
