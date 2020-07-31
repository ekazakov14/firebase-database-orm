import firebase from 'firebase';
import ProcessedProperties from '@type/ProcessedProperties';
import PropertiesToWrite from '@type/PropertiesToWrite';
import FirebaseKey from '@type/FirebaseKey';
import ClassExtendedModel from '@type/ClassExtendedModel';
import Model from '@root/Model';
import UnixTimestamps from '@type/UnixTimestamps';
import PropertiesOf from '@type/PropertiesOf';
import DateTimestamps from '@type/DateTimestamps';

class BaseRepository<T extends Model<T>> {
  public constructor(protected modelConstructor: ClassExtendedModel<T>) {
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
    const value = response.val();

    return value ? this.getProcessedProps(value) : null;
  }

  public save(entity: T, key?: FirebaseKey): Promise<FirebaseKey> {
    return key ? this.set(entity, key) : this.push(entity);
  }

  public async find(condition: Partial<PropertiesToWrite<T>>): Promise<any> {
    const firstKey = Object.keys(condition)[0];
    const snapshot = await
    firebase.database()
      .ref(this.getRoute())
      .orderByChild(firstKey)
      .equalTo(condition[firstKey])
      .once('value');

    const value = snapshot.val();
    return value ? Object.values(value) : null;
  }

  protected async push(entity: T): Promise<FirebaseKey> {
    const currentTimestamp = +new Date();
    const props = this.getPreparedProps(entity.getProps(), currentTimestamp);

    const response = await firebase.database().ref(this.getRoute()).push(props);
    return response.key;
  }

  protected async set(entity: T, key: FirebaseKey): Promise<FirebaseKey> {
    const existingValue = await this.get(key);
    let props = entity.getProps();

    if (existingValue) {
      props = this.getPreparedProps(props, +existingValue.createdAt);
    }

    await firebase.database().ref(`${this.getRoute()}/${key}`).set(props);
    return key;
  }

  protected getPreparedProps = (data: PropertiesOf<T>, createdAt?: number): PropertiesToWrite<T> => {
    let processedData = data;
    const isTimestampsNeeded = this.modelConstructor.timestamps;

    if (isTimestampsNeeded) {
      const timestamps = this.getTimestamps(createdAt);

      processedData = {
        ...data,
        ...timestamps,
      };
    }

    return processedData;
  };

  protected getProcessedProps = ({ createdAt, updatedAt, ...data }: PropertiesToWrite<T>): ProcessedProperties<T> => {
    const parsedTimestamps = this.parseTimestamps({ createdAt, updatedAt });

    return {
      ...data as PropertiesOf<T>,
      ...parsedTimestamps,
    };
  };

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
