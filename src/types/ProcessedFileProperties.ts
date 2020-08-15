import FirebaseFile from './FirebaseFile';

type ProcessedFileProperties<T> = {
  [key in keyof T]: T[key] extends File ? FirebaseFile|null : T[key];
};

export default ProcessedFileProperties;
