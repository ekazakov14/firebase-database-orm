import AbstractModel from '../../src/Model';
import Field from '../../src/decorators/Field';

class Model extends AbstractModel<Model> {
  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field({
    dbKey: 'db_age',
  })
  public age: number;
}

export default Model;
