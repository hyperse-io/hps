import { useState } from 'react';
import { Chip } from '@heroui/react';
import { Inspector } from '@hyperse/inspector';
import Review from './review/App';
import './index.css';

export const AppPage = () => {
  const [active, setActive] = useState(false);

  return (
    <>
      <Inspector
        keys={['$mod', 'i']}
        active={active}
        onActiveChange={setActive}
        onHoverElement={(e) => {
          console.log(e);
        }}
      />
      <div className="flex h-full w-full flex-col items-center justify-center gap-8 overflow-auto p-12">
        <Chip color="accent" variant="soft">
          Hyperse
        </Chip>
        <span className="text-2xl font-bold">Hyperse frontend build tool</span>
        <Review />
      </div>
    </>
  );
};
