import { lazy, Suspense } from 'react';
import Button from './button';

export const SuspendedComp = () => {
  // remoteTypes.d.ts
  const RemoteApp = lazy(() =>
    import('flatjs_evolve_federation_home/Widget').catch((err) => {
      console.log(err);
      return import(
        /* webpackChunkName: "flatjs/evolve/federation-mine/chunks/error" */
        './error'
      );
    })
  );
  return (
    <div>
      <h2>Load Remote Micro Module</h2>
      <Suspense fallback={<div>loading...</div>}>
        <RemoteApp />
      </Suspense>
      <Button />
    </div>
  );
};

export const SuspendedComp1 = () => {
  const RemoteApp1 = lazy(
    () =>
      import(
        /* webpackChunkName: "flatjs/evolve/federation-mine/chunks/error" */
        './error'
      )
  );
  return (
    <div>
      <h2>Load Async</h2>
      <Suspense fallback={<div>loading...</div>}>
        <RemoteApp1 />
      </Suspense>
    </div>
  );
};
