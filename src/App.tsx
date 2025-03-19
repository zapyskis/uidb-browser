import '@ubnt/ui-components/styles/normalize.css';
import '@ubnt/ui-components/styles/reset.css';
import '@ubnt/webfonts/ui-sans-all.css';
import './App.css';

import { Outlet } from '@tanstack/react-router';
import { Header } from './components/layout/Header';
import { ToastProvider } from '@ubnt/ui-components/Toast';

const STYLES = {
  container: 'flex flex-col h-full',
  main: 'flex w-full relative flex-1 flex-col min-h-0',
  content: 'h-full mt-8 mb-8',
};

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => (
  <main className={STYLES.main}>
    <div className={STYLES.content}>{children}</div>
  </main>
);

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <div className={STYLES.container}>
        <Header />
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </ToastProvider>
  );
};
