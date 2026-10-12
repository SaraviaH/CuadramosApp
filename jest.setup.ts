const mockStorage = new Map<string, string>();

jest.mock('react-native-url-polyfill/auto', () => {});
jest.mock('react-native-url-polyfill', () => ({
  setupURLPolyfill: jest.fn(),
}));

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

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        const MockIcon = (props: any) => React.createElement(View, { testID: `icon-${String(prop)}`, ...props });
        MockIcon.displayName = String(prop);
        return MockIcon;
      },
    },
  );
});

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => React.createElement(View, props),
    Svg: (props: any) => React.createElement(View, props),
    Rect: (props: any) => React.createElement(View, props),
    Text: (props: any) => React.createElement(View, props),
    Path: (props: any) => React.createElement(View, props),
    G: (props: any) => React.createElement(View, props),
    Circle: (props: any) => React.createElement(View, props),
    Line: (props: any) => React.createElement(View, props),
  };
});

jest.mock('react-native-gifted-charts', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    BarChart: (props: any) => React.createElement(View, { testID: 'gifted-bar-chart', ...props }),
    LineChart: (props: any) => React.createElement(View, { testID: 'gifted-line-chart', ...props }),
  };
});

let mockCurrentSession: any = null;

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(({ email, password }: any) => {
        if (!email || !password) {
          return Promise.resolve({ data: {}, error: { message: 'Invalid login credentials' } });
        }
        mockCurrentSession = {
          access_token: 'mock-token',
          user: {
            id: 'mock-user-uuid-1234',
            email,
            user_metadata: { name: 'Usuario Prueba', business_name: 'Mi negocio' },
          },
        };
        return Promise.resolve({
          data: {
            user: mockCurrentSession.user,
            session: mockCurrentSession,
          },
          error: null,
        });
      }),
      signUp: jest.fn(({ email, options }: any) => {
        mockCurrentSession = {
          access_token: 'mock-token',
          user: {
            id: 'mock-user-uuid-1234',
            email,
            user_metadata: options?.data || {},
          },
        };
        return Promise.resolve({
          data: {
            user: mockCurrentSession.user,
            session: mockCurrentSession,
          },
          error: null,
        });
      }),
      signOut: jest.fn(() => {
        mockCurrentSession = null;
        return Promise.resolve({ error: null });
      }),
      getSession: jest.fn(() => Promise.resolve({
        data: { session: mockCurrentSession },
        error: null,
      })),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn(() => {
      const queryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        upsert: jest.fn().mockResolvedValue({ data: [], error: null }),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
      return queryBuilder;
    }),
  })),
}));



