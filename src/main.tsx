import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DevicesProvider } from './contexts/DevicesContext.tsx';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DevicesProvider>
      <RouterProvider router={router} />
    </DevicesProvider>
  </StrictMode>,
);
