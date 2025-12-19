import { useContext } from 'react';
import { GlobalContext } from './GlobalContext';

export const useVersion = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) {
    throw new Error('useVersion must be used within a VersionProvider');
  }
  return ctx.version;
};
