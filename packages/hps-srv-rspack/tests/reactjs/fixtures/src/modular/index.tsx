import React from 'react';
import { strClean } from '@dimjs/utils';
import { isObject } from '@dimjs/lang';
import { createRoot } from 'react-dom/client';

const Test = () => {
  return <div>
    <span>
    Test:{strClean('hello')}
    </span>
    <span>
    {isObject({})}
    </span>
  </div>;
};

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(<Test />);
}
