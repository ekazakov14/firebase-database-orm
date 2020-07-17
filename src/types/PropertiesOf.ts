import PropertiesAndMethodsOf from './PropertiesAndMethodsOf';
import OnlyPropertiesKeysOf from './OnlyPropertiesKeysOf';

type PropertiesOf<T> = Pick<PropertiesAndMethodsOf<T>, OnlyPropertiesKeysOf<T>>;

export default PropertiesOf;
