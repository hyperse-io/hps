import { createRoot } from 'react-dom/client';
import './index.less';
import { Time } from './Time';
import { Button } from './Button';



const HomeWidget = () => {
  return (
    <div>
      iframe hmr test
      <Time/>
      <Button/>
    </div>
  );
};

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(<HomeWidget />);
}