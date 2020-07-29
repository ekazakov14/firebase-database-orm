import Model from '../../src/Model';
import Field from '../../src/decorators/Field';

class ModelWithWrongFields extends Model<ModelWithWrongFields> {
  @Field()
  public a: string;

  public b: string;
}

export default ModelWithWrongFields;
