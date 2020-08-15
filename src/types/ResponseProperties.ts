import ProcessedProperties from './ProcessedProperties';
import PropertiesOf from './PropertiesOf';

type ResponseProperties<T> = ProcessedProperties<PropertiesOf<T>>;

export default ResponseProperties;
