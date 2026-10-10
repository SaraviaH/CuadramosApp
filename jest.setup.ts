const mockStorage = new Map<string, string>();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn((key: string) => Promise.resolve(mockStorage.get(key) ?? null)),
    setItem: jest.fn((key: string, value: string) => { mockStorage.set(key, value); return Promise.resolve(); }),
    removeItem: jest.fn((key: string) => { mockStorage.delete(key); return Promise.resolve(); }),
    clear: jest.fn(() => { mockStorage.clear(); return Promise.resolve(); }),
  },
}));

jest.mock('@op-engineering/op-sqlite', () => ({
  open: jest.fn(() => ({
    execute: jest.fn(() => Promise.resolve({ rows: [], rowsAffected: 0 })),
    transaction: jest.fn((fn: any) => fn({
      execute: jest.fn(() => Promise.resolve({ rows: [], rowsAffected: 0 })),
    })),
    close: jest.fn(),
  })),
}));
