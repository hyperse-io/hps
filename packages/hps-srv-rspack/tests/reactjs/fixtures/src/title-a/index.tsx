import { createRoot } from 'react-dom/client';
import './main.less';

function Test() {
  return <div>Title-A</div>;
}
const container = document.getElementById('app');

if (container) {
  createRoot(container).render(<Test />);
}
