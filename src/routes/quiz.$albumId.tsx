import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Flag, Play, RotateCcw } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Header } from "@/components/game/Header";
import { Vinyl } from "@/components/game/AlbumCard";
import { AnswerInput } from "@/components/game/AnswerInput";
import { Tracklist, trackKey } from "@/components/game/Tracklist";
import { Timer } from "@/components/game/Timer";
import { ScorePanel } from "@/components/game/ScorePanel";
import { ResultsScreen } from "@/components/game/ResultsScreen";
import { albums as allAlbums, ALL_ID, getAlbum } from "@/data/discography";
import { matches, normalize, pointsFor } from "@/lib/quiz";
import { saveRecord } from "@/lib/records";

const ALBUM_SECONDS = 10 * 60;
const ALL_SECONDS = 40 * 60;

export const Route = createFileRoute("/quiz/$albumId")({
  loader: ({ params }) => {
    if (params.albumId === ALL_ID) return { title: "Desafio completo", ids: allAlbums.map((a) => a.id) };
    const a = getAlbum(params.albumId);
    if (!a) throw notFound();
    return { title: a.title, ids: [a.id] };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} — Quiz The Weeknd` : "Quiz indisponível";
    return {
      meta: [
        { title },
        { name: "description", content: `Digite todas as músicas de ${loaderData?.title ?? "The Weeknd"} antes do tempo acabar.` },
        { property: "og:title", content: title },
        { property: "og:description", content: "Quiz cronometrado da discografia do The Weeknd." },
      ],
    };
  },
  component: QuizPage,
});

type Phase = "ready" | "playing" | "ended";

function QuizPage() {
  const { albumId } = Route.useParams();
  const { title, ids } = Route.useLoaderData();
  const albums = useMemo(() => ids.map((id) => getAlbum(id)!), [ids]);
  const isAll = albumId === ALL_ID;
  const duration = isAll ? ALL_SECONDS : ALBUM_SECONDS;
  const total = albums.reduce((n, a) => n + a.tracks.length, 0);

  const [phase, setPhase] = useState<Phase>("ready");
  const [remaining, setRemaining] = useState(duration);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "wrong" | "dupe" | "right">("idle");
  const [shakeKey, setShakeKey] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [newRecord, setNewRecord] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setRemaining(duration); setFound(new Set()); setInput(""); setScore(0); setStreak(0);
    setFeedback("idle"); setHint(null); setHintsLeft(3); setNewRecord(false);
  }, [duration]);

  useEffect(() => { reset(); setPhase("ready"); }, [albumId, reset]);

  const start = () => { reset(); setPhase("playing"); setTimeout(() => inputRef.current?.focus(), 50); };

  const finish = useCallback(() => setPhase("ended"), []);

  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => setRemaining((r) => (r <= 1 ? 0 : r - 1)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => { if (phase === "playing" && remaining === 0) finish(); }, [remaining, phase, finish]);
  useEffect(() => { if (phase === "playing" && found.size === total) finish(); }, [found, total, phase, finish]);

  useEffect(() => {
    if (phase === "ended") setNewRecord(saveRecord(albumId, { score, found: found.size, total, date: new Date().toISOString() }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /** Returns keys of all tracks matching the text. */
  const findMatches = (text: string) => {
    const keys: string[] = [];
    albums.forEach((a) => a.tracks.forEach((tr, i) => { if (matches(text, tr)) keys.push(trackKey(a.id, i)); }));
    return keys;
  };

  const tryAnswer = (text: string, explicit: boolean) => {
    const keys = findMatches(text);
    const fresh = keys.filter((k) => !found.has(k));
    if (fresh.length) {
      const next = new Set(found); fresh.forEach((k) => next.add(k));
      let s = streak, pts = 0;
      fresh.forEach(() => { s += 1; pts += pointsFor(s); });
      setFound(next); setStreak(s); setScore((v) => v + pts); setFeedback("right"); setInput(""); setHint(null);
      return;
    }
    if (!explicit) return;
    if (keys.length) setFeedback("dupe");
    else { setFeedback("wrong"); setStreak(0); setShakeKey((k) => k + 1); }
  };

  const onChange = (v: string) => {
    setInput(v);
    if (feedback !== "idle" && feedback !== "right") setFeedback("idle");
    tryAnswer(v, false); // JetPunk-style: accept as soon as it matches
  };
  const onSubmit = () => { if (normalize(input)) tryAnswer(input, true); };

  const askHint = () => {
    const missing: { album: string; title: string; n: number }[] = [];
    albums.forEach((a) => a.tracks.forEach((tr, i) => { if (!found.has(trackKey(a.id, i))) missing.push({ album: a.title, title: tr.title, n: i + 1 }); }));
    if (!missing.length) return;
    const m = missing[Math.floor(Math.random() * missing.length)];
    const initials = m.title.replace(/\([^)]*\)/g, "").trim().split(/\s+/).map((w) => w[0] + "…").join(" ");
    setHint(`${m.album}, faixa ${m.n}: ${initials}`);
    setHintsLeft((h) => h - 1); setStreak(0);
    inputRef.current?.focus();
  };

  const single = albums[0];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-8">
        <Link to="/" hash="albuns" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Álbuns
        </Link>

        {/* QuizHeader */}
        <div className="mt-4 flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-hero bg-card p-5">
          <Vinyl hue={isAll ? 25 : single.hue} className={`w-20 ${phase === "playing" ? "animate-spin-slow" : ""}`} />
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {isAll ? `${albums.length} lançamentos` : `${single.type === "Colaborações" ? "Vários anos" : single.year} · ${single.note === "EP" ? "EP" : single.type}`}
            </p>
            <h1 className="text-2xl font-bold md:text-4xl">{title}</h1>
            <p className="text-sm text-muted-foreground">{total} faixas para descobrir{!isAll && single.note && single.note !== "EP" ? ` · ${single.note}` : ""}</p>
          </div>
          <Timer remaining={remaining} total={duration} />
          {phase === "playing" && (
            <div className="flex gap-2">
              <button onClick={() => setConfirmRestart(true)} aria-label="Reiniciar" className="grid h-10 w-10 place-items-center rounded-full border border-border hover:border-primary"><RotateCcw className="h-4 w-4" /></button>
              <button onClick={finish} className="flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm hover:border-primary"><Flag className="h-4 w-4" /> Desistir</button>
            </div>
          )}
        </div>

        {phase === "ready" && (
          <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="max-w-md text-muted-foreground">
              Você tem {duration / 60} minutos. Digite os nomes das músicas — cada acerto aparece na tracklist na hora.
            </p>
            <button onClick={start} className="flex items-center gap-2 rounded-full bg-red-grad px-8 py-3 font-bold tracking-wider text-primary-foreground shadow-glow">
              <Play className="h-4 w-4" /> COMEÇAR
            </button>
          </div>
        )}

        {phase === "playing" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div className="sticky top-16 z-20 -mx-1 bg-background/90 px-1 pt-2 backdrop-blur">
                <AnswerInput ref={inputRef} value={input} onChange={onChange} onSubmit={onSubmit} feedback={feedback} shakeKey={shakeKey} />
              </div>
              {isAll ? (
                <div className="columns-1 gap-4 space-y-4 md:columns-2">
                  {albums.map((a) => <div key={a.id} className="break-inside-avoid"><Tracklist album={a} found={found} compact /></div>)}
                </div>
              ) : (
                <Tracklist album={single} found={found} />
              )}
            </div>
            <div className="lg:sticky lg:top-20 lg:self-start">
              <ScorePanel found={found.size} total={total} score={score} streak={streak} hint={hint} hintsLeft={hintsLeft} onHint={askHint} canHint />
            </div>
          </div>
        )}

        {phase === "ended" && (
          <div className="mt-8">
            <ResultsScreen title={title} albums={albums} found={found} total={total} score={score} elapsed={duration - remaining} newRecord={newRecord} onPlayAgain={start} />
          </div>
        )}
      </main>

      <AlertDialog open={confirmRestart} onOpenChange={setConfirmRestart}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reiniciar o quiz?</AlertDialogTitle>
            <AlertDialogDescription>Seu progresso atual será perdido.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar jogando</AlertDialogCancel>
            <AlertDialogAction onClick={start}>Reiniciar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
