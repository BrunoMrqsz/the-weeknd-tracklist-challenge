import { Flame, Lightbulb, Target, Trophy } from "lucide-react";

interface Props {
  found: number;
  total: number;
  score: number;
  streak: number;
  hint: string | null;
  hintsLeft: number;
  onHint: () => void;
  canHint: boolean;
}

export function ScorePanel({ found, total, score, streak, hint, hintsLeft, onHint, canHint }: Props) {
  const pct = total ? Math.round((found / total) * 100) : 0;
  const stats = [
    { icon: Target, label: "Acertos", value: `${found}/${total}` },
    { icon: Trophy, label: "Pontos", value: score },
    { icon: Flame, label: "Sequência", value: streak },
  ];
  return (
    <aside className="space-y-4 rounded-xl border border-border bg-card p-5">
      <div>
        <div className="flex items-end justify-between">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Progresso</span>
          <span className="font-display text-2xl font-bold">{pct}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-red-grad transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-lg bg-muted p-3">
            <Icon className="h-4 w-4 text-primary" />
            <div className="mt-2 font-display text-lg font-bold tabular-nums">{value}</div>
            <div className="text-[11px] text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-dashed border-border p-3">
        <button onClick={onHint} disabled={!canHint || hintsLeft === 0} className="flex w-full items-center gap-2 text-sm font-medium text-amber disabled:opacity-40">
          <Lightbulb className="h-4 w-4" /> Pedir dica ({hintsLeft} restantes)
        </button>
        <p className="mt-2 text-xs text-muted-foreground">{hint ?? "A dica mostra as iniciais de uma faixa e zera sua sequência."}</p>
      </div>
    </aside>
  );
}
