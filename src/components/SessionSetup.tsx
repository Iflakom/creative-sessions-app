import { useState } from 'react';
import { useSessionDispatch } from '../context/SessionContext';

interface Props {
  onOpenHistory: () => void;
}

export function SessionSetup({ onOpenHistory }: Props) {
  const dispatch = useSessionDispatch();
  const [name, setName] = useState('');

  const handleStart = () => {
    if (!name.trim()) return;
    dispatch({ type: 'SET_PROJECT_NAME', name: name.trim() });
    dispatch({ type: 'START_SESSION' });
  };

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <h1 className="setup-title">Creative Session</h1>
        <p className="setup-subtitle">3 sections &times; 10 minutes brainstorm</p>
        <input
          type="text"
          className="setup-input"
          placeholder="Project name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          autoFocus
        />
        <button className="setup-button" onClick={handleStart} disabled={!name.trim()}>
          Start Session
        </button>
        <button className="setup-history-btn" onClick={onOpenHistory}>
          View past sessions
        </button>
      </div>
    </div>
  );
}
