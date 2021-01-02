import PropertiesOf from './PropertiesOf';
import RawTimestamps from './timestamps/RawTimestamps';

type PreparedProperties<T> = PropertiesOf<T> & RawTimestamps;

export default PreparedProperties;
