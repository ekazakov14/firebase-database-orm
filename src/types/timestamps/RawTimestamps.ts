import UnixTimestamps from './UnixTimestamps';
import FirebaseTimestamp from './FirebaseTimestamp';

type RawTimestamps = {
  createdAt?: UnixTimestamps['createdAt'] | FirebaseTimestamp,
  updatedAt?: UnixTimestamps['updatedAt'] | FirebaseTimestamp,
};

export default RawTimestamps;
