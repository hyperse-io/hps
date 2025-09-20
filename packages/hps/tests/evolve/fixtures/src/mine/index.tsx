import { createRoot } from 'react-dom/client';
import './index.less';


const container = document.getElementById('app');
if (container) {
  createRoot(container).render(<div>mine</div>);
}
