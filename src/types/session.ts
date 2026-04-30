export type SectionName = 'freestyle' | 'smm-digital' | 'offline-nonstandard';

export interface SectionData {
  name: SectionName;
  displayName: string;
  notes: string;
  drawnCards: string[];
  isComplete: boolean;
}

export type AppScreen = 'setup' | 'session' | 'complete';

export interface SessionState {
  screen: AppScreen;
  projectName: string;
  sections: [SectionData, SectionData, SectionData];
  currentSectionIndex: number;
  availableCards: string[];
  timerRunning: boolean;
  timeRemainingMs: number;
  sectionStarted: boolean;
  timerExpired: boolean;
  selectedSectionIndex: number;
}

export type SessionAction =
  | { type: 'SET_PROJECT_NAME'; name: string }
  | { type: 'START_SESSION' }
  | { type: 'START_SECTION' }
  | { type: 'TIMER_TICK'; deltaMs: number }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'UPDATE_NOTES'; text: string }
  | { type: 'DRAW_CARD' }
  | { type: 'SELECT_SECTION'; index: number }
  | { type: 'COMPLETE_SECTION' }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'RESET' };

export const SECTION_DURATION_MS = 10 * 60 * 1000;

export const SECTIONS_CONFIG: { name: SectionName; displayName: string }[] = [
  { name: 'freestyle', displayName: 'Freestyle' },
  { name: 'smm-digital', displayName: 'SMM & Digital' },
  { name: 'offline-nonstandard', displayName: 'Offline & Non-standard' },
];
