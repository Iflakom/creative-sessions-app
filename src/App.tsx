import { useState, useEffect } from 'react';
import { SessionProvider, useSessionState } from './context/SessionContext';
import { SessionSetup } from './components/SessionSetup';
import { SectionView } from './components/SectionView';
import { SessionComplete } from './components/SessionComplete';
import { SessionHistory } from './components/SessionHistory';
import { migrateFromLocalStorage } from './utils/sessionHistory';
import './App.css';

function AppContent() {
  const { screen } = useSessionState();
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    migrateFromLocalStorage().catch(() => {});
  }, []);

  if (showHistory) {
    return <SessionHistory onClose={() => setShowHistory(false)} />;
  }

  switch (screen) {
    case 'setup':
      return <SessionSetup onOpenHistory={() => setShowHistory(true)} />;
    case 'session':
      return <SectionView />;
    case 'complete':
      return <SessionComplete />;
  }
}

export default function App() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}
