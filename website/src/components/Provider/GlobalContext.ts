'use client';

import type { Context } from 'react';
import { createContext } from 'react';

type GlobalContextType = {
  version: string;
};

export const GlobalContext: Context<GlobalContextType | undefined> =
  createContext<GlobalContextType | undefined>(undefined);
