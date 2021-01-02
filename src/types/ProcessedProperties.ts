import DateTimestamps from './timestamps/DateTimestamps';
import PropertiesOf from './PropertiesOf';

type ProcessedProperties<T> = PropertiesOf<T> & DateTimestamps;

export default ProcessedProperties;
