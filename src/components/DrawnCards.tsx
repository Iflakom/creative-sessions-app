import { useSessionState } from '../context/SessionContext';
import { CardChip } from './CardChip';

export function DrawnCards() {
  const { sections, selectedSectionIndex } = useSessionState();
  const cards = sections[selectedSectionIndex].drawnCards;

  if (cards.length === 0) {
    return (
      <div className="drawn-cards empty">
        <p className="drawn-cards-hint">Drawn cards will appear here</p>
      </div>
    );
  }

  return (
    <div className="drawn-cards">
      {cards.map((card, i) => (
        <CardChip key={`${selectedSectionIndex}-${i}`} text={card} />
      ))}
    </div>
  );
}
