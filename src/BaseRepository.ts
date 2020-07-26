import firebase from 'firebase';
import ProcessedProperties from './types/ProcessedProperties';
import PropertiesToWrite from './types/PropertiesToWrite';
import FirebaseKey from './types/FirebaseKey';
import ClassExtendedModel from './types/ClassExtendedModel';
import Model from './Model';
import UnixTimestamps from './types/UnixTimestamps';

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
    const props = this.getPreparedProps(entity, {
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
    });

    const response = await firebase.database().ref(this.getRoute()).push(props);
    return response.key;
  }

  protected async set(entity: T, key: FirebaseKey): Promise<FirebaseKey> {
    const currentTimestamp = +new Date();

    const existingValue = await this.get(key);
    const props = this.getPreparedProps(entity, {
      createdAt: existingValue !== null ? +existingValue.createdAt : currentTimestamp,
      updatedAt: currentTimestamp,
    });

    await firebase.database().ref(`${this.getRoute()}/${key}`).set(props);
    return key;
  }

  protected getPreparedProps = (entity: T, timestamps: UnixTimestamps): PropertiesToWrite<T> => ({
    ...entity.getProps(),
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
  });

  protected getProcessedProps = (data: PropertiesToWrite<T>): ProcessedProperties<T> => ({
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  });
}

export default BaseRepository;
