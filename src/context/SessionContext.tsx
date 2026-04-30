import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { SessionState, SessionAction, SectionData } from '../types/session';
import { SECTION_DURATION_MS, SECTIONS_CONFIG } from '../types/session';
import { ALL_CARDS } from '../data/cards';
import { shuffleDeck } from '../utils/shuffleCards';

function createInitialSections(): [SectionData, SectionData, SectionData] {
  return SECTIONS_CONFIG.map((cfg): SectionData => ({
    name: cfg.name,
    displayName: cfg.displayName,
    notes: '',
    drawnCards: [] as string[],
    isComplete: false,
  })) as unknown as [SectionData, SectionData, SectionData];
}

function createInitialState(): SessionState {
  return {
    screen: 'setup',
    projectName: '',
    sections: createInitialSections(),
    currentSectionIndex: 0,
    availableCards: [],
    timerRunning: false,
    timeRemainingMs: SECTION_DURATION_MS,
    sectionStarted: false,
    timerExpired: false,
    selectedSectionIndex: 0,
  };
}

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SET_PROJECT_NAME':
      return { ...state, projectName: action.name };

    case 'START_SESSION':
      return {
        ...state,
        screen: 'session',
        availableCards: shuffleDeck(ALL_CARDS),
        currentSectionIndex: 0,
        selectedSectionIndex: 0,
        timeRemainingMs: SECTION_DURATION_MS,
        sectionStarted: false,
        timerRunning: false,
      };

    case 'START_SECTION':
      return {
        ...state,
        sectionStarted: true,
        timerRunning: true,
      };

    case 'TIMER_TICK': {
      const remaining = state.timeRemainingMs - action.deltaMs;
      if (remaining <= 0) {
        return { ...state, timeRemainingMs: 0, timerRunning: false, timerExpired: true };
      }
      return { ...state, timeRemainingMs: remaining };
    }

    case 'TOGGLE_PAUSE':
      return { ...state, timerRunning: !state.timerRunning };

    case 'SELECT_SECTION':
      return { ...state, selectedSectionIndex: action.index };

    case 'UPDATE_NOTES': {
      const sections = [...state.sections] as [SectionData, SectionData, SectionData];
      sections[state.selectedSectionIndex] = {
        ...sections[state.selectedSectionIndex],
        notes: action.text,
      };
      return { ...state, sections };
    }

    case 'DRAW_CARD': {
      if (state.availableCards.length === 0) return state;
      const cards = [...state.availableCards];
      const drawn = cards.pop()!;
      const sections = [...state.sections] as [SectionData, SectionData, SectionData];
      sections[state.currentSectionIndex] = {
        ...sections[state.currentSectionIndex],
        drawnCards: [drawn, ...sections[state.currentSectionIndex].drawnCards],
      };
      return { ...state, availableCards: cards, sections };
    }

    case 'COMPLETE_SECTION': {
      const sections = [...state.sections] as [SectionData, SectionData, SectionData];
      sections[state.currentSectionIndex] = {
        ...sections[state.currentSectionIndex],
        isComplete: true,
      };

      if (state.currentSectionIndex >= 2) {
        return {
          ...state,
          sections,
          timerRunning: false,
          timerExpired: false,
          screen: 'complete',
        };
      }

      return {
        ...state,
        sections,
        currentSectionIndex: state.currentSectionIndex + 1,
        selectedSectionIndex: state.currentSectionIndex + 1,
        timeRemainingMs: SECTION_DURATION_MS,
        timerRunning: false,
        timerExpired: false,
        sectionStarted: false,
      };
    }

    case 'COMPLETE_SESSION':
      return { ...state, screen: 'complete', timerRunning: false };

    case 'RESET':
      return createInitialState();

    default:
      return state;
  }
}

const SessionStateContext = createContext<SessionState | null>(null);
const SessionDispatchContext = createContext<Dispatch<SessionAction> | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, undefined, createInitialState);
  return (
    <SessionStateContext.Provider value={state}>
      <SessionDispatchContext.Provider value={dispatch}>
        {children}
      </SessionDispatchContext.Provider>
    </SessionStateContext.Provider>
  );
}

export function useSessionState(): SessionState {
  const ctx = useContext(SessionStateContext);
  if (!ctx) throw new Error('useSessionState must be used within SessionProvider');
  return ctx;
}

export function useSessionDispatch(): Dispatch<SessionAction> {
  const ctx = useContext(SessionDispatchContext);
  if (!ctx) throw new Error('useSessionDispatch must be used within SessionProvider');
  return ctx;
}
