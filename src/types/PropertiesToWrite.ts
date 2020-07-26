import PropertiesOf from './PropertiesOf';
import UnixTimestamps from './UnixTimestamps';

type PropertiesToWrite<T> = PropertiesOf<T>&UnixTimestamps;

export default PropertiesToWrite;
