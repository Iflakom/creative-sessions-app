import { useEffect, useRef, useState } from 'react';
import { useSessionState, useSessionDispatch } from '../context/SessionContext';
import { saveSession } from '../utils/exportSession';
import { saveSessionToHistory } from '../utils/sessionHistory';
import { CardChip } from './CardChip';

export function SessionComplete() {
  const { projectName, sections } = useSessionState();
  const dispatch = useSessionDispatch();
  const saved = useRef(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    if (!saved.current) {
      saved.current = true;
      saveSessionToHistory({
        projectName,
        date: new Date().toLocaleDateString('ru-RU'),
        timestamp: Date.now(),
        sections: sections.map((s) => ({
          displayName: s.displayName,
          notes: s.notes,
          drawnCards: s.drawnCards,
        })),
      }).catch(() => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveSession(projectName, sections);
      setSavedMsg(result === 'folder' ? 'Saved to folder!' : 'Downloaded!');
    } catch {
      // user cancelled picker
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="complete-screen">
      <div className="complete-container">
        <h1 className="complete-title">Session Complete</h1>
        <p className="complete-project">{projectName}</p>

        <div className="complete-sections">
          {sections.map((section, i) => (
            <div key={i} className="complete-section">
              <h3 className="complete-section-title">{section.displayName}</h3>
              {section.notes ? (
                <pre className="complete-notes">{section.notes}</pre>
              ) : (
                <p className="complete-empty">No notes</p>
              )}
              {section.drawnCards.length > 0 && (
                <div className="complete-cards">
                  {section.drawnCards.map((card, j) => (
                    <CardChip key={j} text={card} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="complete-actions">
          <button className="complete-download-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : savedMsg || 'Save Session'}
          </button>
          <button className="complete-new-btn" onClick={() => dispatch({ type: 'RESET' })}>
            New Session
          </button>
        </div>
      </div>
    </div>
  );
}
