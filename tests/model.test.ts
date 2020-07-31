import Model from './common/Model';
import ModelWithoutFields from './common/ModelWithoutFields';
import ModelWithWrongFields from './common/ModelWithWrongFields';
import { WRONG_PROPERTIES, EMPTY_FIELDS_MODEL } from '@constants/error';

describe('test Model class', () => {
  let user: Model;
  const firstName = 'John';
  const lastName = 'Doe';
  const age = 23;

  const props = {
    firstName,
    lastName,
    age,
  };

  beforeEach(() => {
    user = new Model(props);
  });

  test('correct properties setting in parent constructor', () => {
    expect(user.firstName).toBe(firstName);
    expect(user.lastName).toBe(lastName);
  });

  test('correct props returned from getProps()', () => {
    expect(user.getProps()).toStrictEqual(props);
  });

  test('correct fields return from getFields()', () => {
    expect(Model.getFields()).toStrictEqual([
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
    expect(Model.getFieldsKeys()).toStrictEqual(Object.keys(props));
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
