import FieldOptions from '@type/FieldOptions';
import Field from './Field';

const File = (options?: FieldOptions) => Field({
  ...options,
  type: 'file',
});

export default File;
