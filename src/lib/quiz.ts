import type { Track } from "@/data/discography";

/** Lowercase, strip accents/punctuation, unify "&"/"and", collapse spaces. */
export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\$/g, "s")
    .replace(/[^a-z0-9 ]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** All normalized answers accepted for a track. */
export function acceptedAnswers(track: Track): string[] {
  const base = track.title;
  const set = new Set<string>();
  const add = (s: string) => {
    const n = normalize(s);
    if (n) set.add(n);
  };
  add(base);
  // Without any parenthetical (feat., with, artist names)
  add(base.replace(/\([^)]*\)/g, ""));
  // Keep "(Interlude)", "(Remix)" etc. content as optional
  add(base.replace(/\((feat|with)[^)]*\)/gi, ""));
  for (const a of track.aliases ?? []) add(a);
  for (const a of [...set]) if (a.startsWith("the ")) set.add(a.slice(4));
  return [...set];
}

export function matches(input: string, track: Track): boolean {
  const n = normalize(input);
  if (!n) return false;
  return acceptedAnswers(track).includes(n);
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export const POINTS_PER_TRACK = 100;
/** Streak bonus: +10 per consecutive correct answer beyond the first, capped at +50. */
export function pointsFor(streak: number): number {
  return POINTS_PER_TRACK + Math.min(Math.max(streak - 1, 0) * 10, 50);
}
