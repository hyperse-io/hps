import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HeroUIProvider } from '@heroui/react';
import { AppPage } from './App';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <StrictMode>
    <HeroUIProvider>
      <AppPage />
    </HeroUIProvider>
  </StrictMode>
);
