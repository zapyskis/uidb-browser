import '@ubnt/ui-components/styles/normalize.css';
import '@ubnt/ui-components/styles/reset.css';
import '@ubnt/webfonts/ui-sans-all.css';
import './App.css';

import { Outlet } from '@tanstack/react-router';
import { Header } from './components/layout/Header';

const STYLES = {
  container: 'flex flex-col h-full',
  main: 'flex w-full relative flex-1 flex-col min-h-0',
  content: 'h-full',
  contentSpacing: {
    margin: '16px 32px',
  },
};

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => (
  <main className={STYLES.main}>
    <div className={STYLES.content} style={STYLES.contentSpacing}>
      {children}
    </div>
  </main>
);

export const App: React.FC = () => {
  return (
    <div className={STYLES.container}>
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
    </div>
  );
};
