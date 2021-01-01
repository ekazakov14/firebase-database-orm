import UnixTimestamps from './UnixTimestamps';
import PropertiesOf from './PropertiesOf';

type PreparedProperties<T> = PropertiesOf<T> & UnixTimestamps;

export default PreparedProperties;
