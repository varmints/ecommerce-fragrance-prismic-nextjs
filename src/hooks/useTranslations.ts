'use client';

import { useContext } from 'react';
import { TranslationsContext, TranslationsContextType } from '@/context/TranslationsContext';

export function useTranslations(): NonNullable<TranslationsContextType> {
  const context = useContext(TranslationsContext);

  if (context === null) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }

  return context;
}
