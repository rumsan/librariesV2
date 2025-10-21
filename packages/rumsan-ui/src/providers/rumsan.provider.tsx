'use client';

import { QueryClient } from '@tanstack/react-query';
import React, { FC, createContext } from 'react';

export type RumsanProviderContextType<T = any> = {
  queryClient?: QueryClient;
  data?: T;
};

const RumsanProviderContext = createContext<RumsanProviderContextType>(
  {} as RumsanProviderContextType,
);

type RumsanProviderProps<T = any> = {
  children: React.ReactNode;
  queryClient?: QueryClient;
  data?: T;
};

export const RumsanProvider: FC<RumsanProviderProps> = ({
  children,
  queryClient,
  data,
}) => {
  return (
    <RumsanProviderContext.Provider
      value={{
        queryClient,
        data,
      }}
    >
      {children}
    </RumsanProviderContext.Provider>
  );
};

export function useRumsan<T>() {
  const context = React.useContext(RumsanProviderContext);
  return context as RumsanProviderContextType<T>;
}

// const isAppReady = useMemo(() => {
//   return rumsanService && queryClient;
// }, [rumsanService, queryClient]);

// if (!isAppReady)
//   return (
//     <div className="h-screen flex items-center justify-center bg-customloader bg-auto bg-no-repeat bg-center animate-ping"></div>
//   );
// return children;
