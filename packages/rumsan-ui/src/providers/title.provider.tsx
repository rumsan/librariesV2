'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

// Create a context to hold text and setText
const TitleContext = createContext<
  | {
      title: string;
      setTitle: (newTitle: string) => void;
      throwError: (message: string) => void;
    }
  | undefined
>(undefined);

// Custom hook for easier access to context
export function useTitleContext() {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error('useTextContext must be used within a TextProvider');
  }
  return context;
}

// Create a provider to wrap the parent component
export function TitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('');

  const throwError = (message: string) => {
    console.log(message);
  };

  return (
    <TitleContext.Provider value={{ title, setTitle, throwError }}>
      {children}
    </TitleContext.Provider>
  );
}
