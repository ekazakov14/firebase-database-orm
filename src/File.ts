import firebase from 'firebase';
import 'firebase/storage';
import { v4 } from 'uuid';

class FileModel {
  constructor(protected file: File) {
  }

  public static async get(id: string): Promise<any> {
    return this.child(id).getMetadata();
  }

  public static async getUrl(id: string): Promise<string> {
    return this.child(id).getDownloadURL();
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
