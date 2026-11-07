import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import type { Album } from "@/data/discography";
import { formatTime } from "@/lib/quiz";
import { Tracklist } from "./Tracklist";

interface Props {
  title: string;
  albums: Album[];
  found: Set<string>;
  total: number;
  score: number;
  elapsed: number;
  newRecord: boolean;
  onPlayAgain: () => void;
}

export function ResultsScreen({ title, albums, found, total, score, elapsed, newRecord, onPlayAgain }: Props) {
  const pct = Math.round((found.size / total) * 100);
  const share = async () => {
    const text = `Acertei ${found.size}/${total} músicas (${pct}%) de ${title} no The Weeknd — Discography Challenge! ${score} pts`;
    try {
      if (navigator.share) await navigator.share({ text, url: location.href });
      else { await navigator.clipboard.writeText(`${text} ${location.href}`); toast.success("Resultado copiado!"); }
    } catch { /* user cancelled */ }
  };
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-hero bg-card p-8 text-center">
        {newRecord && <p className="mb-2 text-xs font-bold uppercase tracking-widest text-amber">Novo recorde!</p>}
        <p className="text-sm text-muted-foreground">Pontuação final</p>
        <p className="font-display text-6xl font-bold">{score}</p>
        <div className="mx-auto mt-6 grid max-w-lg grid-cols-3 gap-4 text-sm">
          <div><b className="block font-display text-2xl">{found.size}/{total}</b><span className="text-muted-foreground">músicas</span></div>
          <div><b className="block font-display text-2xl">{pct}%</b><span className="text-muted-foreground">completo</span></div>
          <div><b className="block font-display text-2xl">{formatTime(elapsed)}</b><span className="text-muted-foreground">tempo</span></div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={onPlayAgain} className="rounded-full bg-red-grad px-6 py-3 text-sm font-bold tracking-wider text-primary-foreground">JOGAR NOVAMENTE</button>
          <Link to="/" hash="albuns" className="rounded-full border border-border px-6 py-3 text-sm font-bold tracking-wider hover:border-primary">OUTRO ÁLBUM</Link>
          <button onClick={share} className="rounded-full border border-border px-6 py-3 text-sm font-bold tracking-wider hover:border-primary">COMPARTILHAR</button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">Faixas em <span className="text-foreground">branco</span> você acertou; em <span className="text-primary">vermelho</span>, ficaram faltando.</p>
      <div className={albums.length > 1 ? "columns-1 gap-4 space-y-4 md:columns-2 lg:columns-3" : ""}>
        {albums.map((a) => (
          <div key={a.id} className="break-inside-avoid"><Tracklist album={a} found={found} revealMissing compact={albums.length > 1} /></div>
        ))}
      </div>
    </div>
  );
}
