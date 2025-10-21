//store-tools
import { create, StateCreator, StoreApi, UseBoundStore } from 'zustand';
import { devtools, persist, PersistOptions } from 'zustand/middleware';

interface ICreateStoreOptions<T, U> {
  persistOptions?: PersistOptions<T, U>;
  devtoolsEnabled?: boolean;
}

export function createZustandStore<T extends object>(
  createState: StateCreator<T>,
  options?: ICreateStoreOptions<T, any>,
): UseBoundStore<StoreApi<T>> {
  let store = create(createState);

  if (options?.persistOptions) {
    store = create(persist(createState, options.persistOptions));
  }

  if (options?.devtoolsEnabled) {
    store = create(devtools(createState));
  }

  if (options?.devtoolsEnabled && options?.persistOptions) {
    store = create(devtools(persist(createState, options.persistOptions)));
  }

  return store;
}
