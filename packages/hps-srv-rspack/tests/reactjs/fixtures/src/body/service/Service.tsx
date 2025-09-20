import { lazy } from 'react';

export const Service = () => {
  const Chunk = lazy(
    () =>
      import(/*webpackChunkName:"hps/evolve/body/chunks" */ './Dyamic')
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
