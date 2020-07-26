import PropertiesOf from './PropertiesOf';
import DateTimestamps from './DateTimestamps';

type ProcessedProperties<T> = PropertiesOf<T>&DateTimestamps;

export default ProcessedProperties;
