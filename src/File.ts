import firebase from 'firebase';
import 'firebase/storage';
import { v4 } from 'uuid';

class FileModel {
  constructor(protected file: File) {
  }

  public static async get(id: string): Promise<firebase.storage.Reference> {
    return firebase.storage().ref().child(id);
  }

  public static async getUrl(id: string): Promise<string> {
    return (await this.get(id)).getDownloadURL();
  }

  public async save(id: string = v4()): Promise<string> {
    const snapshot = await firebase.storage().ref().child(id).put(this.file);
    return snapshot.ref.fullPath;
  }
}

export default FileModel;
