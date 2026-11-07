import type { Album } from "@/data/discography";
import { Vinyl } from "./AlbumCard";

interface Props {
  album: Album;
  found: Set<string>;
  revealMissing?: boolean;
  compact?: boolean;
}

export const trackKey = (albumId: string, i: number) => `${albumId}:${i}`;

export function Tracklist({ album, found, revealMissing, compact }: Props) {
  const count = album.tracks.filter((_, i) => found.has(trackKey(album.id, i))).length;
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {compact && (
        <div className="mb-3 flex items-center gap-3">
          <Vinyl hue={album.hue} className="w-10 shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold">{album.title}</h3>
            <p className="text-xs text-muted-foreground">{album.type === "Colaborações" ? "Participações" : album.year}</p>
          </div>
          <span className={`text-xs font-bold ${count === album.tracks.length ? "text-amber" : "text-muted-foreground"}`}>
            {count}/{album.tracks.length}
          </span>
        </div>
      )}
      <ol className="space-y-1">
        {album.tracks.map((tr, i) => {
          const isFound = found.has(trackKey(album.id, i));
          const show = isFound || revealMissing;
          return (
            <li
              key={i}
              className={`flex min-h-8 items-center gap-3 rounded-md px-2 py-1 text-sm ${
                isFound ? "animate-reveal bg-muted text-foreground" : show ? "text-primary" : "bg-muted/40"
              }`}
            >
              <span className="w-5 text-right text-xs text-muted-foreground">{i + 1}</span>
              <span className="truncate">{show ? tr.title : ""}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
