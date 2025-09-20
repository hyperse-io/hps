import { createRoot } from 'react-dom/client';
import './index.less';

const HomeWidget = () => {
  return (
    <div>
      <p>process.env.INSPECTOR_KEYS: {process.env.INSPECTOR_KEYS}</p>
      <p>process.env.INSPECTOR_ENDPOINT: {process.env.INSPECTOR_ENDPOINT}</p>
      <p>process.env.INSPECTOR_HIDE_CONSOLE: {process.env.INSPECTOR_HIDE_CONSOLE}</p>
      <p>process.env.INSPECTOR_HIDE_CONTEXT: {process.env.INSPECTOR_HIDE_CONTEXT}</p>
      <p>process.env.INSPECTOR_HIDE_DOM_PATH_ATTR: {process.env.INSPECTOR_HIDE_DOM_PATH_ATTR}</p>
      <p>process.env.INSPECTOR_DISABLE: {process.env.INSPECTOR_DISABLE}</p>
      <h1>Home Widget</h1>
    </div>
  );
};

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(<HomeWidget />);
}
