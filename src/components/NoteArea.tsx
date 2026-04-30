import { useState, useEffect, useRef } from 'react';
import { useSessionState, useSessionDispatch } from '../context/SessionContext';

export function NoteArea() {
  const { sections, selectedSectionIndex, currentSectionIndex } = useSessionState();
  const dispatch = useSessionDispatch();
  const section = sections[selectedSectionIndex];
  const [localText, setLocalText] = useState(section.notes);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    setLocalText(sections[selectedSectionIndex].notes);
  }, [selectedSectionIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (text: string) => {
    setLocalText(text);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch({ type: 'UPDATE_NOTES', text });
    }, 300);
  };

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const isCurrentSection = selectedSectionIndex === currentSectionIndex;

  return (
    <div className="note-area">
      {!isCurrentSection && (
        <div className="note-area-banner">
          Editing: <strong>{section.displayName}</strong>
        </div>
      )}
      <textarea
        className="note-textarea"
        placeholder="Write your ideas here..."
        value={localText}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}
