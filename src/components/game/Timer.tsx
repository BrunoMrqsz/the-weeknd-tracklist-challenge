import { formatTime } from "@/lib/quiz";

export function Timer({ remaining, total }: { remaining: number; total: number }) {
  const pct = (remaining / total) * 100;
  const low = remaining <= 60;
  return (
    <div className="min-w-32">
      <div className={`font-display text-3xl font-bold tabular-nums ${low ? "text-primary" : ""}`}>{formatTime(remaining)}</div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
        <div className={`h-full transition-all duration-1000 ease-linear ${low ? "bg-primary" : "bg-amber"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
