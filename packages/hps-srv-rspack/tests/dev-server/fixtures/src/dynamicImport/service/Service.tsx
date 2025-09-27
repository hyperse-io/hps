import { lazy, Suspense } from 'react';

export const Service = () => {
  const Chunk = lazy(
    () =>
      import('./Dyamic')
  );
  return (
    <div>
      service
      <Suspense fallback={<div>loading...</div>}>
        <Chunk />
      </Suspense>
    </div>
  );
};
