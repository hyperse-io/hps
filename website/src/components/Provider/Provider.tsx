'use client';

import React, { useMemo } from 'react';
import { GlobalContext } from './GlobalContext';

export const Provider = ({
  children,
  version,
}: {
  children: React.ReactNode;
  version: string;
}) => {
  const nextVersion = useMemo(() => {
    return version || 'latest';
  }, [version]);
  return (
    <GlobalContext.Provider value={{ version: nextVersion }}>
      {children}
    </GlobalContext.Provider>
  );
};
