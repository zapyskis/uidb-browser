import '@ubnt/ui-components/styles/normalize.css';
import '@ubnt/ui-components/styles/reset.css';
import '@ubnt/webfonts/ui-sans-all.css';
import './App.css';

import { Outlet } from '@tanstack/react-router';
import Header from './components/layout/Header';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

function App() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex w-full relative flex-1 flex-col min-h-0">
        <div className="overflow-y-auto">
          <Outlet />
        </div>

        <TanStackRouterDevtools />
      </main>
    </div>
  );
}

export default App;
