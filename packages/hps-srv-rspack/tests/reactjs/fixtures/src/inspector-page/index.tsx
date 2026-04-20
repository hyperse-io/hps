import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');

const InspectorPage = () => {
  return (
    <div>
      <h1>Inspector Page</h1>
    </div>
  );
};

if (container) {
  createRoot(container).render(<InspectorPage />);
}
