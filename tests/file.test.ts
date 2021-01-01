import firebase from 'firebase';
import FileModel from '@root/File';

const uuidKey = 'randomkey';
const fullPath = 'fullPath';

jest.mock('uuid', () => ({
  v4: jest.fn(() => uuidKey),
}));

jest.mock('firebase', () => {
  const returned = (path: string) => ({
    ref: {
      fullPath: path,
    },
  });

  return {
    storage: jest.fn().mockReturnValue({
      ref: jest.fn().mockReturnThis(),
      child: jest.fn((path: string) => ({
        getMetadata: jest.fn(),
        getDownloadURL: jest.fn(() => fullPath),
        put: jest.fn(() => returned(path)),
      })),
    }),
  };
});

describe('test Model class', () => {
  let customKey: string;
  let fileModel: FileModel;
  let file: File;

  beforeEach(() => {
    customKey = 'custom_key';
    file = new window.File(['John'], 'Doe');
    fileModel = new FileModel(customKey);
  });

  test('constructor should use uuid v4 for key generate key without param', async () => {
    const key = new FileModel().getKey();

    expect(key).toBe(uuidKey);
  });

  test('getData() should use firebase child with id', async () => {
    await new FileModel(customKey).getData();

    expect(firebase.storage().ref().child).toHaveBeenCalledWith(customKey);
  });

  test('getData() should return url', async () => {
    const response = await new FileModel(customKey).getData();

    expect(typeof response.url).toBe('string');
  });

  test('getUrl() should return ref.fullpath', async () => {
    const key = await new FileModel(customKey).getUrl();

    expect(key).toBe(fullPath);
  });

  test('upload(key) should use key with put', async () => {
    const key = await fileModel.upload(file);

    expect(key).toBe(customKey);
  });
});
