import { useState } from 'react';
import { Inspector } from '@hyperse/inspector';
import { Dashboard } from './Dashboard';
import './index.css';

export const AppPage = () => {
  const [active, setActive] = useState(false);

  return (
    <div className="h-full w-full">
      <Inspector
        keys={['$mod', 'i']}
        active={active}
        onActiveChange={setActive}
        onHoverElement={(e) => {
          console.log(e);
        }}
      />
      <Dashboard />
    </div>
  );
};
