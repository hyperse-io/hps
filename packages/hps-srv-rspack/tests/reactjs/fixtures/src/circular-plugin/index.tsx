import { createRoot } from 'react-dom/client';
import { getOrderName } from './get-order-id';

function CircularPlugin() {
  return <div>CircularPlugin
    <div>{getOrderName()}</div>
  </div>;
}
const container = document.getElementById('app');

if (container) {
  createRoot(container).render(<CircularPlugin />);
}
