import Model from '@root/Model';
import Field from '@decorators/Field';

class ModelWithoutTimestamps extends Model<ModelWithoutTimestamps> {
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

export default ModelWithoutTimestamps;
