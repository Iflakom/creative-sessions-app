import { useEffect, useState } from 'react';
import { getAllSessions, deleteSession, type StoredSession } from '../utils/sessionHistory';
import { CardChip } from './CardChip';

interface Props {
  onClose: () => void;
}

export function SessionHistory({ onClose }: Props) {
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    getAllSessions().then(setSessions).catch(() => setSessions([]));
  }, []);

  const filtered = query.trim()
    ? sessions.filter((s) =>
        s.projectName.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : sessions;

  const handleDelete = async (id: number) => {
    await deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (expanded === id) setExpanded(null);
  };

  return (
    <div className="history-screen">
      <div className="history-header">
        <button className="history-back" onClick={onClose}>
          ← Back
        </button>
        <h1 className="history-title">All Sessions</h1>
        <input
          className="history-search"
          type="text"
          placeholder="Search by project..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="history-list">
        {filtered.length === 0 && (
          <p className="history-empty">
            {sessions.length === 0 ? 'No sessions yet' : 'No results'}
          </p>
        )}

        {filtered.map((session) => {
          const isOpen = expanded === session.id;
          return (
            <div key={session.id} className={`history-item ${isOpen ? 'open' : ''}`}>
              <div
                className="history-item-header"
                onClick={() => setExpanded(isOpen ? null : (session.id ?? null))}
              >
                <span className="history-item-name">{session.projectName}</span>
                <span className="history-item-date">{session.date}</span>
                <span className="history-item-arrow">{isOpen ? '▲' : '▼'}</span>
                <button
                  className="history-item-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (session.id !== undefined) handleDelete(session.id);
                  }}
                  title="Delete session"
                >
                  ✕
                </button>
              </div>

              {isOpen && (
                <div className="history-item-body">
                  {session.sections.map((sec, i) => {
                    const key = `${session.id}-${i}`;
                    const isSectionOpen = expandedSection === key;
                    return (
                      <div key={i} className="history-section">
                        <button
                          className="history-section-toggle"
                          onClick={() => setExpandedSection(isSectionOpen ? null : key)}
                        >
                          <span className="history-section-name">{sec.displayName}</span>
                          <span className="history-section-arrow">
                            {isSectionOpen ? '▲' : '▼'}
                          </span>
                        </button>
                        {isSectionOpen && (
                          <div className="history-section-body">
                            {sec.notes ? (
                              <pre className="history-notes">{sec.notes}</pre>
                            ) : (
                              <p className="history-empty-section">No notes</p>
                            )}
                            {sec.drawnCards.length > 0 && (
                              <div className="history-cards">
                                {sec.drawnCards.map((card, j) => (
                                  <CardChip key={j} text={card} small />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
