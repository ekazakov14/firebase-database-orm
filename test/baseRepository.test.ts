import firebase from 'firebase';
import Model from '../src/Model';
import Field from '../src/decorators/Field';
import BaseRepository from '../src/BaseRepository';

class User extends Model<User> {
  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field({
    dbKey: 'db_age',
  })
  public age: number;
}

class UserWithCustomRoute extends Model<UserWithCustomRoute> {
  public static routeName = 'custom';
}

const mockData = {
  firstName: 'John',
  lastName: 'Doe',
  age: '13',
};
const testUserId = '123';

jest.mock('firebase', () => {
  const snapshot = (data) => ({
      val: () => data,
  });

  return {
    database: jest.fn().mockReturnValue({
      ref: jest.fn().mockReturnThis(),
      once: jest.fn(() => Promise.resolve(snapshot(mockData))),
      push: jest.fn(() => Promise.resolve(true)),
      set: jest.fn(() => Promise.resolve(true)),
      orderByChild: jest.fn((key) => ({
        equalTo: (value) => ({
          once: (event) => event === 'value' ? snapshot({anykey: {[key]: value}}) : undefined,
        }),
      })),
    }),
  };
});

describe('test BaseRepository class', () => {

  let user = new User({
    firstName: 'John',
    lastName: 'Doe',
    age: 123
  });
  let userRepository: BaseRepository<User>;

  const isFirebaseRefToBe = (route) => {
    expect(firebase.database().ref).toHaveBeenCalledWith(route);
  };

  beforeEach(() => {
    userRepository = new BaseRepository<User>(User);
  });

  test('getRoute() short retun right route for default class', () => {
    expect(userRepository.getRoute()).toBe(`${User.name.toLocaleLowerCase()}s`);
  });

  test('getRoute() should return right route for class with custom routeName', () => {
    const userWithCustomRouteRepository = new BaseRepository<UserWithCustomRoute>(UserWithCustomRoute);
    expect(userWithCustomRouteRepository.getRoute()).toBe(UserWithCustomRoute.routeName);
  });

  test('get() should return data', async () => {
    const value = await userRepository.get(testUserId);
    expect(value).toBe(mockData);
  });

  test('get() should use right route', async () => {
    await userRepository.get(testUserId);
    isFirebaseRefToBe(userRepository.getRoute(testUserId));
  });

  test('getAll() should return Object.values(data)', async() => {
    const value = await userRepository.getAll();
    expect(value).toStrictEqual(Object.values(mockData));
  });

  test('getAll() should use right route', async() => {
    await userRepository.getAll();
    isFirebaseRefToBe(userRepository.getRoute());
  });

  test('find() should return right data', async () => {
    const field = 'firstName';
    const value = 'John';
    const findObj = {[field]: value};

    const findedObj = await userRepository.find(findObj);
    expect(findedObj).toStrictEqual([findObj]);
  });

  test('find() should use right route', async () => {
    isFirebaseRefToBe(userRepository.getRoute());
  });

  test('save() without key should push data', async () => {
    await userRepository.save(user);
    expect(firebase.database().ref().push).toHaveBeenCalledWith(user.getProps());
  });

  test('save() should use right route without key', async () => {
    await userRepository.save(user);
    isFirebaseRefToBe(userRepository.getRoute());
  });

  test('save() with key should set data', async () => {
    await userRepository.save(user, testUserId);
    expect(firebase.database().ref().set).toHaveBeenCalledWith(user.getProps());
  });

  test('save() should use right route with key', async () => {
    await userRepository.save(user, testUserId);
    isFirebaseRefToBe(userRepository.getRoute(testUserId));
  });

});