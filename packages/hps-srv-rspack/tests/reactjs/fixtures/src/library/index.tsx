import { createRoot } from 'react-dom/client';
import { Service } from './service/Service';

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(
    <div>
      provider module
      <Service />
    </div>
  );
}
