import { useSessionState, useSessionDispatch } from '../context/SessionContext';
import { CardChip } from './CardChip';

export function MobileCardTray() {
  const { sections, selectedSectionIndex, currentSectionIndex, availableCards } = useSessionState();
  const dispatch = useSessionDispatch();
  const cards = sections[selectedSectionIndex].drawnCards;
  const isCurrentSection = selectedSectionIndex === currentSectionIndex;
  const canDraw = isCurrentSection && availableCards.length > 0;

  return (
    <div className="mobile-card-tray">
      <div className="mobile-card-tray-cards">
        {cards.length === 0 ? (
          <span className="mobile-card-tray-empty">Карточки появятся здесь</span>
        ) : (
          cards.map((card, i) => (
            <CardChip key={`${selectedSectionIndex}-${i}`} text={card} small />
          ))
        )}
      </div>
      <button
        className="mobile-draw-btn"
        onClick={() => dispatch({ type: 'DRAW_CARD' })}
        disabled={!canDraw}
        title={!isCurrentSection ? 'Switch to current section to draw cards' : undefined}
      >
        ?
      </button>
    </div>
  );
}
