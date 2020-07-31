import Model from '@root/Model';
import Field from '@decorators/Field';

class ModelWithCustomRoute extends Model<ModelWithCustomRoute> {
  public static routeName = '123';

  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field({
    dbKey: 'db_age',
  })
  public age: number;
}

export default ModelWithCustomRoute;
