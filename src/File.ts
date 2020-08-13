import firebase from 'firebase';
import 'firebase/storage';
import { v4 } from 'uuid';
import { STORAGE_OBJECT_NOT_FOUND } from '@constants/error';

class FileModel {
  constructor(protected file: File) {
  }

  public static async get(id: string): Promise<any> {
    const metaPromise = this.child(id).getMetadata();
    const urlPromise = this.getUrl(id);

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

  public static async getUrl(id: string): Promise<string|null> {
    try {
      return await this.child(id).getDownloadURL();
    } catch (error) {
      // eslint-disable-next-line no-underscore-dangle
      if (error.code_ === STORAGE_OBJECT_NOT_FOUND) {
        return null;
      }

      throw error;
    }
  }

  public async save(id: string = v4()): Promise<string> {
    const snapshot = await FileModel.child(id).put(this.file);
    return snapshot.ref.fullPath;
  }

  protected static child(id: string): firebase.storage.Reference {
    return firebase.storage().ref().child(id);
  }
}

export default FileModel;
