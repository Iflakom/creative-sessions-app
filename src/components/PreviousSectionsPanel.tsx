import { useSessionState, useSessionDispatch } from '../context/SessionContext';

export function PreviousSectionsPanel() {
  const { sections, currentSectionIndex, selectedSectionIndex, sectionStarted } =
    useSessionState();
  const dispatch = useSessionDispatch();

  return (
    <aside className="sections-nav">
      <div className="sections-nav-label">Sections</div>
      {sections.map((section, i) => {
        const isActive = i === currentSectionIndex && sectionStarted;
        const isComplete = section.isComplete;
        const isFuture = i > currentSectionIndex;
        const isSelected = i === selectedSectionIndex;
        const isClickable = isActive || isComplete;

        return (
          <button
            key={i}
            className={[
              'sections-nav-item',
              isSelected ? 'selected' : '',
              isActive ? 'active' : '',
              isComplete ? 'complete' : '',
              isFuture ? 'future' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            disabled={!isClickable}
            onClick={() => dispatch({ type: 'SELECT_SECTION', index: i })}
          >
            <span className="sections-nav-indicator">
              {isComplete ? '✓' : isActive ? '●' : '○'}
            </span>
            <span className="sections-nav-name">{section.displayName}</span>
          </button>
        );
      })}
    </aside>
  );
}
