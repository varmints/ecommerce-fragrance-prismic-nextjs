'use client';

import { createContext } from 'react';
import { Content } from '@prismicio/client';

export type TranslationsContextType = Content.TranslationsDocument['data'] | null;

export const TranslationsContext = createContext<TranslationsContextType>(null);
