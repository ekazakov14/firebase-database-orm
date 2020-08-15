import DateTimestamps from './DateTimestamps';
import ProcessedFileProperties from './ProcessedFileProperties';

type ProcessedProperties<T> = ProcessedFileProperties<T> & DateTimestamps;

export default ProcessedProperties;
