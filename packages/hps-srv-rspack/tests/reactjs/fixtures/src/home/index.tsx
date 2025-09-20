import { createRoot } from 'react-dom/client';
import HomeWidget from './widget';
import './index.less';
import '../shared/index.less';

const container = document.getElementById('app');

if (container) {
  createRoot(container).render(<HomeWidget />);
}
