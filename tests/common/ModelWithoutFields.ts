import Model from '../../src/Model';

class ModelWithoutFields extends Model<ModelWithoutFields> {
  public a: string;

  public b: string;
}

export default ModelWithoutFields;
