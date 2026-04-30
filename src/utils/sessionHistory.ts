export interface StoredSession {
  id?: number;
  projectName: string;
  date: string;
  timestamp: number;
  sections: { displayName: string; notes: string; drawnCards: string[] }[];
}

const DB_NAME = 'creative-sessions-db';
const STORE = 'sessions';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveSessionToHistory(session: Omit<StoredSession, 'id'>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).add(session);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getAllSessions(): Promise<StoredSession[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => {
      const sessions = (req.result as StoredSession[]).sort(
        (a, b) => b.timestamp - a.timestamp,
      );
      resolve(sessions);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteSession(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

let migrationDone = false;

/** One-time migration from legacy localStorage format */
export async function migrateFromLocalStorage(): Promise<void> {
  if (migrationDone) return;
  migrationDone = true;

  const KEY = 'creative-sessions-history';
  const raw = localStorage.getItem(KEY);
  if (!raw) return;

  // Remove immediately to prevent double-migration in StrictMode
  localStorage.removeItem(KEY);

  try {
    const old = JSON.parse(raw) as { projectName: string; date: string; sections: { displayName: string; drawnCards: string[] }[] }[];
    for (const s of old.reverse()) {
      await saveSessionToHistory({
        projectName: s.projectName,
        date: s.date,
        timestamp: Date.now(),
        sections: s.sections.map((sec) => ({
          displayName: sec.displayName,
          notes: '',
          drawnCards: sec.drawnCards,
        })),
      });
    }
  } catch {
    // ignore malformed data
  }
}
