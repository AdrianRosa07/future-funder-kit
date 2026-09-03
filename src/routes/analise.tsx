import { createFileRoute } from "@tanstack/react-router";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { AppShell, StatCard } from "@/components/AppShell";
import { brl, patrimonio, posicoes } from "@/lib/portfolio-data";

export const Route = createFileRoute("/analise")({
  head: () => ({
    meta: [
      { title: "Análise da carteira | RendaViva" },
      {
        name: "description",
        content:
          "Nota fundamentalista, concentração por ativo e relação entre dividend yield e qualidade dos seus investimentos.",
      },
      { property: "og:title", content: "Análise da carteira | RendaViva" },
      {
        property: "og:description",
        content: "Qualidade, concentração e dividend yield dos ativos da sua carteira.",
      },
    ],
  }),
  component: Analise,
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

function Analise() {
  const ordenados = [...posicoes].sort((a, b) => b.atual - a.atual);
  const notaMedia =
    posicoes.reduce((s, p) => s + p.notaFundamentalista * p.atual, 0) / patrimonio;
  const maiorPeso = ordenados[0]!;
  const dyMedio = posicoes.reduce((s, p) => s + p.dyAno * p.atual, 0) / patrimonio;

  const scatter = posicoes.map((p) => ({
    x: p.notaFundamentalista,
    y: p.dyAno,
    z: p.atual,
    ticker: p.ticker,
  }));

  return (
    <AppShell
      title="Análise da carteira"
      subtitle="Qualidade, concentração e eficiência dos seus dividendos."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Nota média ponderada" value={notaMedia.toFixed(1)} hint="Escala 0 a 10" />
        <StatCard label="DY médio da carteira" value={`${dyMedio.toFixed(2)}%`} tone="up" />
        <StatCard
          label="Maior concentração"
          value={maiorPeso.ticker}
          hint={`${((maiorPeso.atual / patrimonio) * 100).toFixed(1)}% · ${brl(maiorPeso.atual)}`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border/60 bg-surface p-5 shadow-card">
          <h2 className="text-sm font-semibold">Qualidade x dividend yield</h2>
          <p className="text-xs text-muted-foreground">
            Ideal: ativos no canto superior direito (nota alta com bom yield).
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" dataKey="x" domain={[6, 10]} name="Nota" {...axis} />
                <YAxis type="number" dataKey="y" name="DY" unit="%" {...axis} />
                <ZAxis type="number" dataKey="z" range={[60, 500]} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v: number, n: string) => [n === "z" ? brl(v) : v, n]}
                />
                <Scatter data={scatter} fill="var(--color-primary)" fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-surface p-5 shadow-card">
          <h2 className="text-sm font-semibold">Concentração por ativo</h2>
          <ul className="mt-4 space-y-3">
            {ordenados.map((p) => {
              const peso = (p.atual / patrimonio) * 100;
              return (
                <li key={p.ticker}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{p.ticker}</span>
                    <span className="tabular-nums text-muted-foreground">{peso.toFixed(1)}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-elevated">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${Math.min(peso * 3, 100)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-card">
        <h2 className="border-b border-border/60 px-5 py-4 text-sm font-semibold">
          Radar fundamentalista
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="[&>th]:px-5 [&>th]:py-3 [&>th]:text-right [&>th:first-child]:text-left">
                <th>Ativo</th>
                <th>Setor</th>
                <th>Nota</th>
                <th>DY 12m</th>
                <th>Peso</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((p) => {
                const peso = (p.atual / patrimonio) * 100;
                const alerta = peso > 20 ? "Concentrado" : p.notaFundamentalista < 7.5 ? "Monitorar" : "Saudável";
                const tone =
                  alerta === "Saudável"
                    ? "text-positive"
                    : alerta === "Concentrado"
                      ? "text-negative"
                      : "text-warning";
                return (
                  <tr
                    key={p.ticker}
                    className="border-t border-border/50 [&>td]:px-5 [&>td]:py-3 [&>td]:text-right [&>td:first-child]:text-left"
                  >
                    <td className="font-medium">{p.ticker}</td>
                    <td>{p.setor}</td>
                    <td className="tabular-nums">{p.notaFundamentalista.toFixed(1)}</td>
                    <td className="tabular-nums">{p.dyAno.toFixed(1)}%</td>
                    <td className="tabular-nums">{peso.toFixed(1)}%</td>
                    <td className={tone}>{alerta}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
