import AbstractModel from '@root/Model';
import Field from '@decorators/Field';

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
