export interface RecordEntry { score: number; found: number; total: number; date: string }
const KEY = "tw-discography-records";

export function loadRecords(): Record<string, RecordEntry> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

/** Saves only if the new score beats the stored one. Returns true when it is a new record. */
export function saveRecord(id: string, entry: RecordEntry): boolean {
  const all = loadRecords();
  if (all[id] && all[id].score >= entry.score) return false;
  all[id] = entry;
  localStorage.setItem(KEY, JSON.stringify(all));
  return true;
}
