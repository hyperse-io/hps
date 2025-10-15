import { createRoot } from 'react-dom/client';
import HomeWidget from './widget';

const container = document.getElementById('app');

if (container) {
  createRoot(container).render(<HomeWidget />);
}
