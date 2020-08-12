import UnixTimestamps from './UnixTimestamps';
import PreparedFileProperties from './PreparedFileProperties';

type PreparedProperties<T> = PreparedFileProperties<T> & UnixTimestamps;

export default PreparedProperties;
