/* eslint-disable max-classes-per-file */

import Model from '../src/Model';
import Field from '../src/decorators/Field';
import { WRONG_PROPERTIES, EMPTY_FIELDS_MODEL } from '../src/constants/error';

class User extends Model<User> {
  @Field()
  public firstName: string;

  @Field()
  public lastName: string;
}

class ModelWithoutFields extends Model<ModelWithoutFields> {
  public a: string;

  public b: string;
}

class ModelWithWrongFields extends Model<ModelWithWrongFields> {
  @Field()
  public a: string;

  public b: string;
}

class CustomModel extends Model<CustomModel> {
  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field({
    dbKey: 'db_age',
  })
  public age: number;
}

describe('test Model class', () => {
  let user: User;
  const userFirstName = 'John';
  const userLastName = 'Doe';

  const props = {
    firstName: userFirstName,
    lastName: userLastName,
  };

  beforeEach(() => {
    user = new User(props);
  });

  test('correct properties setting in parent constructor', () => {
    expect(user.firstName).toBe(userFirstName);
    expect(user.lastName).toBe(userLastName);
  });

  test('correct props returned from getProps()', () => {
    expect(user.getProps()).toStrictEqual(props);
  });

  test('correct fields return from getFields()', () => {
    expect(CustomModel.getFields()).toStrictEqual([
      {
        dbKey: 'firstName',
        key: 'firstName',
      },
      {
        dbKey: 'lastName',
        key: 'lastName',
      },
      {
        dbKey: 'db_age',
        key: 'age',
      },
    ]);
  });

  test('correct fields return from getFieldsKeys()', () => {
    expect(User.getFieldsKeys()).toStrictEqual(Object.keys(props));
  });

  test('throw error in costructor of model with wrong fields', () => {
    const expectedError = new Error(WRONG_PROPERTIES);
    const error = () => new ModelWithWrongFields({
      a: 'test',
      b: 'test',
    });
    expect(error).toThrow(expectedError);
  });

  test('throw error in costructor of model without fields', () => {
    const expectedError = new Error(EMPTY_FIELDS_MODEL);
    const error = () => new ModelWithoutFields({
      a: 'test',
      b: 'test',
    });
    expect(error).toThrow(expectedError);
  });
});
