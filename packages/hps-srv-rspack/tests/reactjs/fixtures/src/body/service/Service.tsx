import { lazy } from 'react';

export const Service = () => {
  const Chunk = lazy(
    () =>
      import(/*webpackChunkName:"flatjs/evolve/body/chunks" */ './Dyamic')
  );
  return (
    <div>
      service
      <p>
        <Chunk />
      </p>
    </div>
  );
};
