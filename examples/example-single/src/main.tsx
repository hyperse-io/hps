import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppPage } from './App';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <StrictMode>
    <AppPage />
  </StrictMode>
);
