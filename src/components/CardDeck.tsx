import { useSessionState, useSessionDispatch } from '../context/SessionContext';

export function CardDeck() {
  const { availableCards, selectedSectionIndex, currentSectionIndex } = useSessionState();
  const dispatch = useSessionDispatch();
  const isCurrentSection = selectedSectionIndex === currentSectionIndex;

  return (
    <button
      className="card-deck-btn"
      onClick={() => dispatch({ type: 'DRAW_CARD' })}
      disabled={!isCurrentSection || availableCards.length === 0}
      title={!isCurrentSection ? 'Switch to current section to draw cards' : undefined}
    >
      <span className="card-deck-icon">?</span>
      <span className="card-deck-label">Draw Card</span>
      <span className="card-deck-count">
        {isCurrentSection ? `${availableCards.length} left` : 'current section only'}
      </span>
    </button>
  );
}
