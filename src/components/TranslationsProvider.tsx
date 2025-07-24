'use client';

import { ReactNode } from 'react';
import { TranslationsContext, TranslationsContextType } from '@/context/TranslationsContext';

type TranslationsProviderProps = {
  children: ReactNode;
  value: TranslationsContextType;
};

export function TranslationsProvider({ children, value }: TranslationsProviderProps) {
  return <TranslationsContext.Provider value={value}>{children}</TranslationsContext.Provider>;
}
