import { Link } from "@tanstack/react-router";

export function XOLogo() {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full border border-primary font-display text-sm font-bold text-primary">
      XO
    </span>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-3">
          <XOLogo />
          <span className="hidden font-display text-sm font-bold tracking-widest sm:block">
            THE WEEKND <span className="text-muted-foreground">— DISCOGRAPHY CHALLENGE</span>
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link to="/" hash="albuns" className="hover:text-foreground">Álbuns</Link>
          <Link to="/" hash="como-jogar" className="hover:text-foreground">Como jogar</Link>
          <Link to="/" hash="recordes" className="hover:text-foreground">Meus recordes</Link>
          <span className="hidden rounded-full border border-amber/40 px-3 py-1 text-xs text-amber md:inline">Modo clássico</span>
        </nav>
      </div>
    </header>
  );
}
