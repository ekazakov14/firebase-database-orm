import firebase from 'firebase';
import 'firebase/storage';
import { v4 } from 'uuid';
import { STORAGE_OBJECT_NOT_FOUND } from '@constants/error';
import FirebaseFile from '@type/FirebaseFile';

const child = (key: string): firebase.storage.Reference => firebase.storage().ref().child(key);

class FileModel {
  protected file: File;

  constructor(protected key: string = v4()) {
  }

  public async getData(): Promise<FirebaseFile|null> {
    const metaPromise = this.getMetadata();
    const urlPromise = this.getUrl();

    try {
      const [meta, url] = await Promise.all([metaPromise, urlPromise]);

      return {
        ...meta,
        url,
      };
    } catch (error) {
      // eslint-disable-next-line no-underscore-dangle
      if (error.code_ === STORAGE_OBJECT_NOT_FOUND) {
        return null;
      }

      throw error;
    }
  }

  public async getMetadata(): Promise<firebase.storage.FullMetadata> {
    return child(this.key).getMetadata();
  }

  public async getUrl(): Promise<string|null> {
    try {
      return child(this.key).getDownloadURL();
    } catch (error) {
      // eslint-disable-next-line no-underscore-dangle
      if (error.code_ === STORAGE_OBJECT_NOT_FOUND) {
        return null;
      }

      throw error;
    }
  }

  public async upload(file?: File): Promise<string> {
    const fileToUpload = file !== undefined ? file : this.getFile();
    const snapshot = await child(this.key).put(fileToUpload);

    return snapshot.ref.fullPath;
  }

  public setFile(file: File) {
    this.file = file;
    return this;
  }

  public getFile() {
    return this.file;
  }

  public getKey(): string {
    return this.key;
  }
}

export default FileModel;
