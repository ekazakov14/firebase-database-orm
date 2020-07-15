import PropertiesOf from './types/PropertiesOf';
import firebase from 'firebase';
import FirebaseKey from './types/FirebaseKey';
import Model from './Model';

class BaseRepository<T extends Model<T>> {
  public constructor(protected modelConstructor: { new (...args: any): T, name: string, routeName: string }) {
  }

  public getRoute(additional?: string): string {
    const baseRoute = this.modelConstructor.routeName ?? `${this.modelConstructor.name.toLocaleLowerCase()}s`;
    return additional ? `${baseRoute}/${additional}` : baseRoute;
  }

  public async get(key: FirebaseKey) {
    const response = await firebase.database().ref(`${this.getRoute()}/${key}`).once('value');
    return await response.val() as PropertiesOf<T>;
  }

  public save(entity: T, key?: FirebaseKey): Promise<FirebaseKey> {
    return key ? this.set(entity, key) : this.push(entity);
  }

  public async getAll(): Promise<T[]|null> {
    const response = await firebase.database().ref(this.getRoute()).once('value');
    const value = await response.val() as T[];

    return value ? Object.values(value) : null;
  }

  public async find(condition: Partial<PropertiesOf<T>>): Promise<any> {
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
    const response = await firebase.database().ref(this.getRoute()).push(entity.getProps());
    return response.key;
  }

  protected async set(entity: T, key: FirebaseKey): Promise<FirebaseKey> {
    await firebase.database().ref(`${this.getRoute()}/${key}`).set(entity.getProps());
    return key;
  }
}

export default BaseRepository;