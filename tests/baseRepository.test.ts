/* eslint-disable max-classes-per-file */

import firebase from 'firebase';
import BaseRepository from '../src/BaseRepository';
import {
  User,
  UserWithCustomRoute,
} from './common/User';

const currentDate = new Date();

const mockData = {
  firstName: 'John',
  lastName: 'Doe',
  age: 13,
};

const mockDataToWrite = {
  ...mockData,
  createdAt: +currentDate,
  updatedAt: +currentDate,
};

const processedProperties = {
  ...mockData,
  createdAt: new Date(currentDate),
  updatedAt: new Date(currentDate),
};

const testUserId = '123';

jest.mock('firebase', () => {
  const snapshot = (data) => ({
    val: () => data,
  });

  return {
    database: jest.fn().mockReturnValue({
      ref: jest.fn().mockReturnThis(),
      once: jest.fn(() => Promise.resolve(snapshot(mockDataToWrite))),
      push: jest.fn(() => Promise.resolve(true)),
      set: jest.fn(() => Promise.resolve(true)),
      orderByChild: jest.fn((key) => ({
        equalTo: (value) => ({
          once: (event) => (event === 'value' ? snapshot({ anykey: { [key]: value } }) : undefined),
        }),
      })),
    }),
  };
});

describe('test BaseRepository class', () => {
  const user = new User(mockData);
  let userRepository: BaseRepository<User>;

  const isFirebaseRefToBe = (route) => {
    expect(firebase.database().ref).toHaveBeenCalledWith(route);
  };

  beforeEach(() => {
    userRepository = new BaseRepository<User>(User);
  });

  test('getRoute() short return right route for default class', () => {
    expect(userRepository.getRoute()).toBe(`${User.name.toLocaleLowerCase()}s`);
  });

  test('getRoute() should return right route for class with custom routeName', () => {
    // eslint-disable-next-line max-len
    const userWithCustomRouteRepository = new BaseRepository<UserWithCustomRoute>(UserWithCustomRoute);
    expect(userWithCustomRouteRepository.getRoute()).toBe(UserWithCustomRoute.routeName);
  });

  test('get() should return data', async () => {
    const value = await userRepository.get(testUserId);
    expect(value).toStrictEqual(processedProperties);
  });

  test('get() should use right route', async () => {
    await userRepository.get(testUserId);
    isFirebaseRefToBe(userRepository.getRoute(testUserId));
  });

  test('getAll() should use right route', async () => {
    await userRepository.getAll();
    isFirebaseRefToBe(userRepository.getRoute());
  });

  test('find() should return right data', async () => {
    const field = 'firstName';
    const value = 'John';
    const findObj = { [field]: value };

    const findedObj = await userRepository.find(findObj);
    expect(findedObj).toStrictEqual([findObj]);
  });

  test('find() should use right route', async () => {
    await userRepository.find({ firstName: '123' });
    isFirebaseRefToBe(userRepository.getRoute());
  });

  test('save() without key should have base props', async () => {
    await userRepository.save(user);
    const calledWith = jest.spyOn(firebase.database().ref(), 'push').mock.calls[0][0];
    expect(calledWith).toMatchObject(user.getProps());
  });

  test('save() should use right route without key', async () => {
    await userRepository.save(user);
    isFirebaseRefToBe(userRepository.getRoute());
  });

  test('save() with key should have base props', async () => {
    await userRepository.save(user, testUserId);
    const calledWith = jest.spyOn(firebase.database().ref(), 'set').mock.calls[0][0];
    expect(calledWith).toMatchObject(user.getProps());
  });

  test('save() should use right route with key', async () => {
    await userRepository.save(user, testUserId);
    isFirebaseRefToBe(userRepository.getRoute(testUserId));
  });
});
