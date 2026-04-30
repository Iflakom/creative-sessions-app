import type { SectionData } from '../types/session';
import { getStoredDirHandle, storeDirHandle } from './directoryHandle';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Zа-яА-ЯёЁ0-9_\- ]/g, '_').trim() || 'session';
}

function buildContent(projectName: string, sections: SectionData[]): string {
  const lines: string[] = [];
  lines.push(`Project: ${projectName}`);
  lines.push(`Date: ${new Date().toLocaleDateString('ru-RU')}`);
  lines.push('');

  for (const section of sections) {
    lines.push(`=== ${section.displayName} ===`);
    lines.push('');
    lines.push('Notes:');
    lines.push(section.notes || '(no notes)');
    lines.push('');
    lines.push('Drawn cards:');
    if (section.drawnCards.length > 0) {
      section.drawnCards.forEach((card, i) => lines.push(`  ${i + 1}. ${card}`));
    } else {
      lines.push('  (no cards drawn)');
    }
    lines.push('');
    lines.push('');
  }
  return lines.join('\n');
}

function fallbackDownload(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function saveSession(
  projectName: string,
  sections: SectionData[],
): Promise<'folder' | 'download'> {
  const content = buildContent(projectName, sections);
  const safeName = sanitizeName(projectName);
  const d = new Date();
  const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
  const filename = `${dateStr}.txt`;

  type FSHandle = FileSystemDirectoryHandle & {
    queryPermission: (opts: { mode: string }) => Promise<string>;
    requestPermission: (opts: { mode: string }) => Promise<string>;
  };
  type PickerFn = (opts?: { mode?: string }) => Promise<FSHandle>;
  const picker = (window as unknown as { showDirectoryPicker?: PickerFn }).showDirectoryPicker;

  if (!picker) {
    fallbackDownload(content, `${safeName}_${filename}`);
    return 'download';
  }

  try {
    let rootHandle = (await getStoredDirHandle()) as FSHandle | null;

    if (rootHandle) {
      const perm = await rootHandle.queryPermission({ mode: 'readwrite' });
      if (perm !== 'granted') {
        const req = await rootHandle.requestPermission({ mode: 'readwrite' });
        if (req !== 'granted') rootHandle = null;
      }
    }

    if (!rootHandle) {
      rootHandle = await picker({ mode: 'readwrite' });
      await storeDirHandle(rootHandle);
    }

    const projectDir = await rootHandle.getDirectoryHandle(safeName, { create: true });
    const fileHandle = await projectDir.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    return 'folder';
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      fallbackDownload(content, `${safeName}_${filename}`);
      return 'download';
    }
    throw err;
  }
}

export { buildContent };
