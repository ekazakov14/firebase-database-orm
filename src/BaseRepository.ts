import firebase from 'firebase';
import ProcessedProperties from '@type/ProcessedProperties';
import PreparedProperties from '@root/types/PreparedProperties';
import FirebaseKey from '@type/FirebaseKey';
import ConstructorOf from '@root/types/ConstructorOf';
import Model from '@root/Model';
import UnixTimestamps from '@type/UnixTimestamps';
import ModelStaticProperties from '@type/ModelStaticProperties';
import PropertiesOf from '@type/PropertiesOf';
import DateTimestamps from '@type/DateTimestamps';
import FileModel from '@root/File';
import PreparedFileProperties from './types/PreparedFileProperties';

class BaseRepository<T extends Model<T>> {
  public constructor(protected modelConstructor: ConstructorOf<T, ModelStaticProperties>) {
  }

  public getRoute(additional?: string): string {
    const baseRoute = this.modelConstructor.routeName ?? `${this.modelConstructor.name.toLocaleLowerCase()}s`;
    return additional ? `${baseRoute}/${additional}` : baseRoute;
  }

  public async getAll(): Promise<ProcessedProperties<T>[] | []> {
    const response = await firebase.database().ref(this.getRoute()).once('value');
    let value = await response.val();
    value = value ? Object.values(value) : [];

    return value.map((props) => this.getProcessedProps(props));
  }

  public async get(key: FirebaseKey): Promise<ProcessedProperties<T> | null> {
    const response = await firebase.database().ref(`${this.getRoute()}/${key}`).once('value');
    const value = response.val() as PreparedProperties<T>;

    return value ? this.getProcessedProps(value) : null;
  }

  public save(entity: T, key?: FirebaseKey): Promise<FirebaseKey> {
    return key ? this.set(entity, key) : this.push(entity);
  }

  public async find(condition: Partial<PreparedProperties<T>>): Promise<ProcessedProperties<T>[]|null> {
    const firstKey = Object.keys(condition)[0];
    const snapshot = await
    firebase.database()
      .ref(this.getRoute())
      .orderByChild(firstKey)
      .equalTo(condition[firstKey])
      .once('value');

    const value = snapshot.val();
    const items = value ? Object.values(value) as PreparedProperties<T>[] : null;

    if (items) {
      const promises = items.map((props) => this.getProcessedProps(props));
      return Promise.all(promises);
    }

    return null;
  }

  protected async push(entity: T): Promise<FirebaseKey> {
    const currentTimestamp = +new Date();
    const props = await this.getPreparedProps(entity.getProps(), currentTimestamp);

    const response = await firebase.database().ref(this.getRoute()).push(props);
    return response.key;
  }

  protected async set(entity: T, key: FirebaseKey): Promise<FirebaseKey> {
    const existingValue = await this.get(key);
    let props: PropertiesOf<T>|PreparedProperties<T> = entity.getProps();

    if (existingValue) {
      props = await this.getPreparedProps(props, +existingValue.createdAt);
    }

    await firebase.database().ref(`${this.getRoute()}/${key}`).set(props);
    return key;
  }

  protected getPreparedProps = async (data: PropertiesOf<T>, createdAt?: number): Promise<PreparedProperties<T>> => {
    let processedData = data;
    const isTimestampsNeeded = this.modelConstructor.timestamps;

    if (isTimestampsNeeded) {
      const timestamps = this.getTimestamps(createdAt);

      processedData = {
        ...data,
        ...timestamps,
      };
    }

    return this.prepareFiles(processedData);
  };

  protected async prepareFiles(props: PropertiesOf<T>): Promise<PreparedFileProperties<T>> {
    const resultProps: PreparedFileProperties<T> = props;
    const filePromises: Promise<string>[] = [];

    const fileFields = this.modelConstructor.getFields({ type: 'file' });
    fileFields.forEach((fieldMeta) => {
      const fieldKey = fieldMeta.key;
      const file = new FileModel(props[fieldKey]);
      const promise = file.save().then((fileKey) => {
        resultProps[fieldKey] = fileKey;
        return fileKey;
      });
      filePromises.push(promise);
    });

    await Promise.all(filePromises);
    return resultProps;
  }

  protected getProcessedProps = async (props: PreparedProperties<T>): Promise<ProcessedProperties<T>> => {
    const { createdAt, updatedAt, ...data } = props;
    let processedData = data as PropertiesOf<T>;

    if (this.modelConstructor.timestamps) {
      const parsedTimestamps = this.parseTimestamps({ createdAt, updatedAt });
      processedData = {
        ...processedData,
        ...parsedTimestamps,
      };
    }

    return this.processFiles(processedData);
  };

  protected async processFiles(props: PreparedProperties<T>): Promise<PropertiesOf<T>> {
    const resultProps = props;
    const filePromises: Promise<any>[] = [];

    const fileFields = this.modelConstructor.getFields({ type: 'file' });
    fileFields.forEach((fieldMeta) => {
      const fieldKey = fieldMeta.key;
      const promise = FileModel.get(resultProps[fieldKey]).then((file) => {
        resultProps[fieldKey] = file;
        return file;
      });
      filePromises.push(promise);
    });

    await Promise.all(filePromises);
    return resultProps as PropertiesOf<T>;
  }

  protected getTimestamps = (createdAt?: number): UnixTimestamps => {
    const currentTimestamp = +new Date();

    return {
      createdAt: createdAt || currentTimestamp,
      updatedAt: currentTimestamp,
    };
  };

  protected parseTimestamps = ({ createdAt, updatedAt }: UnixTimestamps): DateTimestamps => ({
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  });
}

export default BaseRepository;
