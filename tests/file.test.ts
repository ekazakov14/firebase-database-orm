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
  let file: FileModel;

  beforeEach(() => {
    customKey = 'custom_key';
    const randomFile = new window.File(['John'], 'Doe');
    file = new FileModel(randomFile);
  });

  test('get() should use firebase child with id', async () => {
    await FileModel.get(customKey);

    expect(firebase.storage().ref().child).toHaveBeenCalledWith(customKey);
  });

  test('get() should return url', async () => {
    const response = await FileModel.get(customKey);

    expect(typeof response.url).toBe('string');
  });

  test('getUrl() should return ref.fullpath', async () => {
    const key = await FileModel.getUrl(customKey);

    expect(key).toBe(fullPath);
  });

  test('save() should use uuid v4 for key generate key without param', async () => {
    const key = await file.save();

    expect(key).toBe(uuidKey);
  });

  test('save(key) should use key with put', async () => {
    const key = await file.save(customKey);

    expect(key).toBe(customKey);
  });
});
