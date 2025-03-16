import './App.css';
import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

function App() {
  return (
    <main>
      <Outlet />
      <TanStackRouterDevtools />
    </main>
  );
}

export default App;
