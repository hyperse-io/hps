import { lazy, Suspense } from 'react';
import { isArray } from '@dimjs/lang';
import { strCapitalizeAll } from '@dimjs/utils';
import image404 from '../assets/pc-404.png';
import imageWebp from '../assets/temp.webp';
import { pagingResponseHandel } from './pagination';

export default function HomeWidget() {
  const x = pagingResponseHandel<string>({
    rows: [],
    total: 100,
  });
  const Chunk = lazy(
    () => import(/* webpackChunkName: "flatjs/evolve/home/chunks" */ './chunk')
  );
  return (
    <div>
      <img src={image404} width="440" alt="" />
      <img src={imageWebp} width="440" alt="" />
      <Suspense fallback={<div>loading...</div>}>
        <Chunk />
      </Suspense>
      Home Widget {JSON.stringify(x)}{' '}
      {isArray([]) ? strCapitalizeAll('capitalizeAll111') : ''}{' '}
    </div>
  );
}
