import { useSessionState, useSessionDispatch } from '../context/SessionContext';

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function Timer() {
  const { timeRemainingMs, timerRunning, timerExpired, currentSectionIndex, sections, sectionStarted } =
    useSessionState();
  const dispatch = useSessionDispatch();
  const section = sections[currentSectionIndex];
  const isUrgent = timeRemainingMs <= 60_000 && timeRemainingMs > 0;
  const isCritical = timeRemainingMs <= 10_000 && timeRemainingMs > 0;
  const nextSection = currentSectionIndex < 2 ? sections[currentSectionIndex + 1] : null;

  return (
    <>
      <header className="timer-bar">
        <div className="timer-section-name">
          {currentSectionIndex + 1}/3: {section.displayName}
        </div>
        <div
          className={`timer-display ${isUrgent ? 'urgent' : ''} ${isCritical ? 'critical' : ''} ${timerExpired ? 'expired' : ''}`}
        >
          {timerExpired ? '00:00' : formatTime(timeRemainingMs)}
        </div>
        <div className="timer-controls">
          {sectionStarted && !timerExpired && (
            <>
              <button className="timer-btn" onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}>
                {timerRunning ? 'Pause' : 'Resume'}
              </button>
              <button
                className="timer-btn finish-btn"
                onClick={() => dispatch({ type: 'COMPLETE_SECTION' })}
              >
                Finish
              </button>
            </>
          )}
          {timerExpired && (
            <button
              className="timer-btn continue-btn"
              onClick={() => dispatch({ type: 'COMPLETE_SECTION' })}
            >
              {nextSection ? `Continue → ${nextSection.displayName}` : 'See Results →'}
            </button>
          )}
        </div>
      </header>
      {timerExpired && (
        <div className="timer-expired-banner">
          Time's up! Finish your thought, then continue when ready.
        </div>
      )}
    </>
  );
}
