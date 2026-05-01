import { useState } from 'react';
import { useSessionState, useSessionDispatch } from '../context/SessionContext';
import { useTimer } from '../hooks/useTimer';
import { Timer } from './Timer';
import { NoteArea } from './NoteArea';
import { CardDeck } from './CardDeck';
import { DrawnCards } from './DrawnCards';
import { PreviousSectionsPanel } from './PreviousSectionsPanel';

export function SectionView() {
  const { sectionStarted, sections, currentSectionIndex } = useSessionState();
  const dispatch = useSessionDispatch();
  const [mobileTab, setMobileTab] = useState<'notes' | 'cards'>('notes');
  useTimer();

  const section = sections[currentSectionIndex];

  if (!sectionStarted) {
    return (
      <div className="section-start-screen">
        <div className="section-start-card">
          <div className="section-start-index">{currentSectionIndex + 1}/3</div>
          <h2 className="section-start-name">{section.displayName}</h2>
          <p className="section-start-desc">10 minutes to brainstorm</p>
          <button
            className="section-start-btn"
            onClick={() => dispatch({ type: 'START_SECTION' })}
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-view">
      <Timer />
      <div className="mobile-tabs">
        <button
          className={`mobile-tab-btn ${mobileTab === 'notes' ? 'active' : ''}`}
          onClick={() => setMobileTab('notes')}
        >
          Notes
        </button>
        <button
          className={`mobile-tab-btn ${mobileTab === 'cards' ? 'active' : ''}`}
          onClick={() => setMobileTab('cards')}
        >
          Cards
        </button>
      </div>
      <main className={`section-content mobile-tab-${mobileTab}`}>
        <PreviousSectionsPanel />
        <NoteArea />
        <aside className="section-sidebar">
          <CardDeck />
          <DrawnCards />
        </aside>
      </main>
    </div>
  );
}
