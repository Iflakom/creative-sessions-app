# Creative Sessions App

Local brainstorming tool: 3 sections × 10 min timer, text notes, random creative prompt cards, saves to .txt.

**Run:** `npm run dev` → http://localhost:5173

## Stack

Vite + React 19 + TypeScript. No external dependencies beyond React.

## Architecture

State: single `useReducer` in `SessionContext.tsx`. Three screens: setup → session (3 sections) → complete.

```
src/
  types/session.ts          — all TS types + SECTION_DURATION_MS constant
  data/cards.ts             — ~175 creative prompt cards (Russian)
  context/SessionContext.tsx — reducer, SessionProvider, useSessionState/useSessionDispatch hooks
  hooks/useTimer.ts          — countdown timer (setInterval + drift correction via Date.now())
  utils/
    shuffleCards.ts          — Fisher-Yates shuffle, called once on session start
    exportSession.ts         — builds .txt string, triggers browser download
  components/
    SessionSetup.tsx         — project name input screen
    SectionView.tsx          — main layout (composes Timer + NoteArea + CardDeck + DrawnCards)
    Timer.tsx                — MM:SS display, pause/resume, finish section button
    NoteArea.tsx             — textarea (local useState + 300ms debounce → dispatch)
    CardDeck.tsx             — "Draw Card" button, pops from shuffled availableCards array
    DrawnCards.tsx           — scrollable list of drawn cards for current section
    CardChip.tsx             — single card with pop-in CSS animation
    SessionComplete.tsx      — summary of all 3 sections + download .txt button
  App.tsx                    — screen router (setup/session/complete)
  App.css                    — all styles, dark theme, CSS custom properties
```

## Key State Shape

```ts
SessionState {
  screen: 'setup' | 'session' | 'complete'
  projectName: string
  sections: [SectionData, SectionData, SectionData]  // always exactly 3
  currentSectionIndex: 0 | 1 | 2
  availableCards: string[]   // shuffled deck, draw = pop()
  timerRunning: boolean
  timeRemainingMs: number    // for current section
  sectionStarted: boolean    // shows start overlay when false
}
```

## Reducer Actions

`SET_PROJECT_NAME` · `START_SESSION` · `START_SECTION` · `TIMER_TICK` · `TOGGLE_PAUSE` · `UPDATE_NOTES` · `DRAW_CARD` · `COMPLETE_SECTION` · `COMPLETE_SESSION` · `RESET`

## Sections Config

Defined in `src/types/session.ts` → `SECTIONS_CONFIG`:
- `freestyle` → "Freestyle"
- `smm-digital` → "SMM & Digital"  
- `offline-nonstandard` → "Offline & Non-standard"

## CSS Theme

Dark vars in `App.css`: `--bg-primary #0a0a0f`, `--accent #e94560`, `--bg-card #1a1a2e`. All component styles are in this single file, grouped by component.
