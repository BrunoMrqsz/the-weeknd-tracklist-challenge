import { Link } from "@tanstack/react-router";
import type { Album } from "@/data/discography";
import type { RecordEntry } from "@/lib/records";

export function Vinyl({ hue, className = "" }: { hue: number; className?: string }) {
  return (
    <div
      className={`vinyl aspect-square ${className}`}
      style={{ ["--vinyl-label" as string]: `oklch(0.5 0.17 ${hue})` }}
    />
  );
}

export function AlbumCard({ album, record }: { album: Album; record?: RecordEntry }) {
  const pct = record ? Math.round((record.found / record.total) * 100) : 0;
  return (
    <Link
      to="/quiz/$albumId"
      params={{ albumId: album.id }}
      className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-4 transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow"
    >
      <div className="relative overflow-hidden rounded-lg bg-muted p-5">
        <Vinyl hue={album.hue} className="w-full transition duration-700 group-hover:rotate-45" />
      </div>
      <div className="flex-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {album.type === "Colaborações" ? "Vários anos" : album.year} · {album.note === "EP" ? "EP" : album.type}
        </p>
        <h3 className="mt-1 text-lg font-bold leading-tight">{album.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{album.tracks.length} faixas</p>
      </div>
      <div>
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>{record ? `${record.found}/${record.total}` : "Não jogado"}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </Link>
  );
}

export function AlbumGrid({ albums, records }: { albums: Album[]; records: Record<string, RecordEntry> }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {albums.map((a) => <AlbumCard key={a.id} album={a} record={records[a.id]} />)}
    </div>
  );
}
