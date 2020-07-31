import Model from '@root/Model';
import Field from '@decorators/Field';

class ModelWithWrongFields extends Model<ModelWithWrongFields> {
  @Field()
  public a: string;

  public b: string;
}

export default ModelWithWrongFields;
