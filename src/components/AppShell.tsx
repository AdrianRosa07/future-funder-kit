import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LineChart, Coins, Target, Wallet, TrendingUp } from "lucide-react";

const nav = [
  { to: "/", label: "Carteira", icon: Wallet },
  { to: "/proventos", label: "Proventos", icon: Coins },
  { to: "/aportes", label: "Aportes", icon: Target },
  { to: "/analise", label: "Análise", icon: LineChart },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
              <TrendingUp className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Renda<span className="text-primary">Viva</span>
            </span>
          </Link>
          <nav className="ml-auto flex items-center gap-1">
            {nav.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
                activeProps={{ className: "bg-elevated text-foreground" }}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {children}
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        RendaViva · dados de demonstração, não é recomendação de investimento.
      </footer>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "up" | "down";
}) {
  const toneClass =
    tone === "up" ? "text-positive" : tone === "down" ? "text-negative" : "text-foreground";
  return (
    <div className="rounded-2xl border border-border/60 bg-surface p-5 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-semibold tabular-nums ${toneClass}`}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
