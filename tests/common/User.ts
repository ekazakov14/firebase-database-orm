/* eslint-disable max-classes-per-file */

import Model from '../../src/Model';
import Field from '../../src/decorators/Field';

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

class UserWithoutTimestamps extends Model<User> {
  public static timestamps = false;

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

class ModelWithoutFields extends Model<ModelWithoutFields> {
  public a: string;

  public b: string;
}

class ModelWithWrongFields extends Model<ModelWithWrongFields> {
  @Field()
  public a: string;

  public b: string;
}

export {
  User,
  UserWithCustomRoute,
  ModelWithoutFields,
  ModelWithWrongFields,
  UserWithoutTimestamps,
};
