import { createId } from '@paralleldrive/cuid2';
import { User } from '@rumsan/sdk/types/user.types';
import { isJwtTokenExpired } from '../utils/jwt.utils';
import { localStore } from '../utils/local.store';
import { createZustandStore } from '../utils/zustand.store';

type RumsanAppState = {
  accessToken: string | null;
  isDebugMode: boolean;
  clientId: string | null;
  appId: string | null;
  challenge: string | null;
  currentUser: User<Record<string, any>> | null;
  roles: Record<string, any> | null;

  isInitialized: boolean;
  isAuthenticated: boolean;
};

type RumsanAppStateFunctions = {
  initialize: (data: {
    clientId?: string;
    log?: string;
    callback?: () => void;
  }) => void;
  setClientId: (clientId: string | null) => void;
  setChallenge: (challenge: string | null | null) => void;
  setAppId: (appId: string | null) => void;
  setAccessToken: (accessToken: string | null) => void;
  setDebugMode: (isDebugMode: boolean) => void;
  setCurrentUser: <T extends Record<string, any> | undefined>(
    user: User | null,
    details?: T,
  ) => void;
  clearCurrentUser: () => void;
  clearStore: () => void;
  logout: () => void;
};

type RumsanAppStore = RumsanAppState & RumsanAppStateFunctions;

const initialStore = {
  clientId: null,
  accessToken: null,
  isDebugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  appId: null,
  challenge: null,
  currentUser: null,
  roles: [],

  isInitialized: false,
  isAuthenticated: false,
};

export const useRumsanAppStore = createZustandStore<RumsanAppStore>(
  (set, get) => ({
    ...initialStore,

    initialize: (data: {
      clientId?: string;
      log?: string;
      callback?: () => void;
    }) => {
      set({
        isInitialized: true,
        clientId: get().clientId || data.clientId || createId(),
      });

      const acToken = get().accessToken;
      if (acToken && !isJwtTokenExpired(acToken as string)) {
        set({
          isAuthenticated: true,
        });
      }
      if (data.callback) data.callback();
    },
    setClientId: (clientId: string | null) => {
      set({
        clientId,
      });
    },
    setDebugMode: (isDebugMode: boolean) => {
      set({
        isDebugMode,
      });
    },
    setCurrentUser: <T extends Record<string, any> | undefined>(
      user: User<T> | null,
      details?: T,
    ) => {
      if (user && details) {
        user.details = details;
      }
      set({
        currentUser: user,
      });
    },
    clearCurrentUser: () => {
      set({
        currentUser: null,
      });
    },
    setChallenge: (challenge: string | null) =>
      set({
        challenge,
      }),
    setAppId: (appId: string | null) => {
      set({
        appId,
      });
    },

    setAccessToken: (accessToken: string | null) => {
      set({
        accessToken,
      });
      if (accessToken && !isJwtTokenExpired(accessToken as string)) {
        set({
          isAuthenticated: true,
        });
      } else {
        set({
          isAuthenticated: false,
        });
      }
    },

    logout: () => {
      set({
        accessToken: null,
        currentUser: null,
        challenge: null,
        isAuthenticated: false,
      });
    },
    clearStore: () => {
      set(initialStore);
      if (window && window.localStorage) window.localStorage.clear();
      set({
        isAuthenticated: false,
      });
    },
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'RumsanAppStore',
      storage: localStore,
      partialize: (state) => ({
        currentUser: state.currentUser,
        accessToken: state.accessToken,
        clientId: state.clientId,
        isDebugMode: state.isDebugMode,
        appId: state.appId,
      }),
    },
  },
);
