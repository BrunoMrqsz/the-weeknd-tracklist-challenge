import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Disc3, Keyboard, Timer, Trophy } from "lucide-react";
import { Header } from "@/components/game/Header";
import { AlbumGrid, Vinyl } from "@/components/game/AlbumCard";
import { albums, ALL_ID, totalTracks } from "@/data/discography";
import { loadRecords, type RecordEntry } from "@/lib/records";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Weeknd — Discography Challenge" },
      { name: "description", content: "Quantas músicas do The Weeknd você consegue nomear antes do tempo acabar?" },
      { property: "og:title", content: "The Weeknd — Discography Challenge" },
      { property: "og:description", content: "Quiz cronometrado: digite todas as músicas do The Weeknd, álbum por álbum." },
    ],
  }),
  component: Index,
});

function Hero() {
  return (
    <section className="bg-hero">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber">XO · {totalTracks} faixas</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] md:text-6xl">
            HOW WELL DO YOU KNOW <span className="text-primary">THE WEEKND?</span>
          </h1>
          <p className="mt-5 max-w-md text-muted-foreground">
            Explore cada era. Complete cada álbum. Você consegue nomear todas as faixas antes do tempo acabar?
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/quiz/$albumId" params={{ albumId: ALL_ID }} className="rounded-full bg-red-grad px-6 py-3 text-sm font-bold tracking-wider text-primary-foreground shadow-glow transition hover:brightness-110">
              DESAFIO COMPLETO
            </Link>
            <Link to="/" hash="albuns" className="rounded-full border border-border px-6 py-3 text-sm font-bold tracking-wider transition hover:border-primary">
              ESCOLHER UM ÁLBUM
            </Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <Vinyl hue={25} className="w-full animate-spin-slow" />
          <span className="absolute inset-0 grid place-items-center font-display text-2xl font-bold text-primary-foreground">XO</span>
        </div>
      </div>
    </section>
  );
}

function Index() {
  const [records, setRecords] = useState<Record<string, RecordEntry>>({});
  useEffect(() => setRecords(loadRecords()), []);
  const played = Object.entries(records).filter(([id]) => id !== ALL_ID);
  const all = records[ALL_ID];

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />

      <section id="albuns" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-14">
        <h2 className="text-2xl font-bold md:text-3xl">Escolha uma era</h2>
        <p className="mt-1 mb-8 text-muted-foreground">Ordem cronológica. Cada álbum tem 10 minutos.</p>
        <AlbumGrid albums={albums} records={records} />
      </section>

      <section id="como-jogar" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-14">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Como jogar</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Disc3, t: "Escolha", d: "Um álbum, ou o desafio completo com toda a discografia." },
            { icon: Keyboard, t: "Digite", d: "Escreva o nome das músicas. Acertou? A faixa aparece na hora, sem precisar apertar Enter." },
            { icon: Timer, t: "Corra", d: "Maiúsculas, acentos e pontuação não importam. Acertos seguidos dão bônus." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-xl border border-border bg-card p-6">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-bold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="recordes" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-14">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Meus recordes</h2>
        {played.length === 0 && !all ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Nenhum recorde ainda. Jogue um álbum para começar.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {all && <RecordRow title="Desafio completo" r={all} />}
            {played.map(([id, r]) => (
              <RecordRow key={id} title={albums.find((a) => a.id === id)?.title ?? id} r={r} />
            ))}
          </ul>
        )}
      </section>
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Projeto de fã, sem afiliação com The Weeknd ou XO.
      </footer>
    </div>
  );
}

function RecordRow({ title, r }: { title: string; r: RecordEntry }) {
  return (
    <li className="flex items-center justify-between gap-4 px-5 py-4">
      <span className="flex items-center gap-3"><Trophy className="h-4 w-4 text-amber" />{title}</span>
      <span className="text-sm text-muted-foreground">{r.found}/{r.total} · <b className="text-foreground">{r.score} pts</b></span>
    </li>
  );
}
