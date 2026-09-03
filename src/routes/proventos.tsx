import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, StatCard } from "@/components/AppShell";
import {
  brl,
  proventosMensais,
  proventosRecebidos,
  proximosProventos,
  rendaAnual,
  rendaMensal,
  yieldOnCost,
} from "@/lib/portfolio-data";

export const Route = createFileRoute("/proventos")({
  head: () => ({
    meta: [
      { title: "Proventos e dividendos | RendaViva" },
      {
        name: "description",
        content:
          "Histórico de dividendos, JCP e rendimentos de FIIs, com calendário dos próximos pagamentos da sua carteira.",
      },
      { property: "og:title", content: "Proventos e dividendos | RendaViva" },
      {
        property: "og:description",
        content: "Histórico e calendário de dividendos, JCP e rendimentos de FIIs.",
      },
    ],
  }),
  component: Proventos,
});

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--color-foreground)",
};

const acumulado = proventosMensais.reduce<{ mes: string; total: number }[]>((acc, m, i) => {
  acc.push({ mes: m.mes, total: (acc[i - 1]?.total ?? 0) + m.valor });
  return acc;
}, []);

function Proventos() {
  const melhorMes = proventosMensais.reduce((a, b) => (b.valor > a.valor ? b : a));

  return (
    <AppShell title="Proventos" subtitle="Dividendos, JCP e rendimentos que caem na sua conta.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Recebido em 12 meses" value={brl(rendaAnual)} tone="up" />
        <StatCard label="Média mensal" value={brl(rendaMensal)} />
        <StatCard label="Melhor mês" value={brl(melhorMes.valor)} hint={melhorMes.mes} />
        <StatCard label="Yield on cost" value={`${yieldOnCost.toFixed(2)}%`} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border/60 bg-surface p-5 shadow-card">
          <h2 className="text-sm font-semibold">Recebimentos mensais</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={proventosMensais}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="mes" {...axis} />
                <YAxis {...axis} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
                <Tooltip
                  cursor={{ fill: "var(--color-elevated)" }}
                  contentStyle={tooltipStyle}
                  formatter={(v: number) => [brl(v), "Recebido"]}
                />
                <Bar dataKey="valor" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-surface p-5 shadow-card">
          <h2 className="text-sm font-semibold">Acumulado no período</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={acumulado}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="mes" {...axis} />
                <YAxis {...axis} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [brl(v), "Acumulado"]} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-card">
          <h2 className="border-b border-border/60 px-5 py-4 text-sm font-semibold">
            Últimos recebimentos
          </h2>
          <ul>
            {proventosRecebidos.map((p) => (
              <li
                key={`${p.data}-${p.ticker}`}
                className="flex items-center gap-3 border-b border-border/40 px-5 py-3 text-sm last:border-0"
              >
                <span className="font-medium">{p.ticker}</span>
                <span className="rounded-full bg-elevated px-2 py-0.5 text-xs text-muted-foreground">
                  {p.tipo}
                </span>
                <span className="text-xs text-muted-foreground">{p.data}</span>
                <span className="ml-auto tabular-nums text-positive">{brl(p.valor)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-card">
          <h2 className="border-b border-border/60 px-5 py-4 text-sm font-semibold">
            Calendário dos próximos pagamentos
          </h2>
          <ul>
            {proximosProventos.map((p) => (
              <li
                key={`${p.data}-${p.ticker}`}
                className="flex items-center gap-3 border-b border-border/40 px-5 py-3 text-sm last:border-0"
              >
                <span className="font-medium">{p.ticker}</span>
                <span className="rounded-full bg-elevated px-2 py-0.5 text-xs text-muted-foreground">
                  {p.tipo}
                </span>
                <span className="text-xs text-muted-foreground">
                  {p.data} · {p.status}
                </span>
                <span className="ml-auto tabular-nums">{brl(p.valor)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
