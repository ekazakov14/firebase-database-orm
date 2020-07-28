/* eslint-disable max-classes-per-file */

import firebase from 'firebase';
import BaseRepository from '../src/BaseRepository';
import {
  User,
  UserWithoutTimestamps,
} from './common/User';
import UnixTimestamps from '../src/types/UnixTimestamps';

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
  let userWTRepository: BaseRepository<UserWithoutTimestamps>;

  const isObjectHaveTimestamps = ({ createdAt, updatedAt }: UnixTimestamps) => (
    typeof createdAt === 'number' && typeof updatedAt === 'number'
  );

  const isObjectDoesNotHaveTimestamps = ({ createdAt, updatedAt }: UnixTimestamps) => (
    createdAt === undefined && updatedAt === undefined
  );

  beforeEach(() => {
    userRepository = new BaseRepository<User>(User);
    userWTRepository = new BaseRepository<UserWithoutTimestamps>(UserWithoutTimestamps);
  });

  test('save() should use timestamps with timestamps property === true', async () => {
    await userRepository.save(user);
    const calledWith = jest.spyOn(firebase.database().ref(), 'push').mock.calls[0][0];
    expect(isObjectHaveTimestamps(calledWith)).toBe(true);
  });

  test('save() should not use timestamps with timestamps property === false', async () => {
    await userWTRepository.save(user);
    const calledWith = jest.spyOn(firebase.database().ref(), 'push').mock.calls[0][0];
    expect(isObjectDoesNotHaveTimestamps(calledWith)).toBe(true);
  });
});
