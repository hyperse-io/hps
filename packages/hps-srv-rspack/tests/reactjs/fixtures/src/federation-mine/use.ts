import { type MutableRefObject, useEffect, useRef } from 'react';

export const useStore = (): MutableRefObject<string | null> => {
  const curRef = useRef<null | string>('');
  useEffect(() => {
    console.log('useEffect');
    curRef.current = '1';
    return function clean() {
      console.log('useEffect clean');
      curRef.current = null;
    };
  }, []);
  return curRef;
};
