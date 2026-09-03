import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, StatCard } from "@/components/AppShell";
import {
  alocacaoPorClasse,
  brl,
  evolucaoPatrimonio,
  lucroTotal,
  patrimonio,
  pct,
  posicoes,
  proventosMensais,
  rendaMensal,
  rentabilidade,
  totalInvestido,
  yieldOnCost,
} from "@/lib/portfolio-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Carteira e renda passiva | RendaViva" },
      {
        name: "description",
        content:
          "Acompanhe patrimônio, rentabilidade, dividendos e alocação da sua carteira de ações, FIIs e renda fixa em um só painel.",
      },
      { property: "og:title", content: "Carteira e renda passiva | RendaViva" },
      {
        property: "og:description",
        content: "Painel completo de investimentos: patrimônio, proventos e alocação por classe.",
      },
    ],
  }),
  component: Carteira,
});

const donutColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

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

function Carteira() {
  return (
    <AppShell
      title="Minha carteira"
      subtitle="Visão consolidada de ações, FIIs, stocks e renda fixa."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Patrimônio" value={brl(patrimonio)} hint={`Investido ${brl(totalInvestido)}`} />
        <StatCard
          label="Lucro/Prejuízo"
          value={brl(lucroTotal)}
          hint={pct(rentabilidade)}
          tone={lucroTotal >= 0 ? "up" : "down"}
        />
        <StatCard
          label="Renda passiva mensal"
          value={brl(rendaMensal)}
          hint="Média dos últimos 12 meses"
          tone="up"
        />
        <StatCard label="Yield on cost" value={`${yieldOnCost.toFixed(2)}%`} hint="Sobre o valor investido" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-border/60 bg-surface p-5 shadow-card lg:col-span-2">
          <h2 className="text-sm font-semibold">Evolução do patrimônio x aportes</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolucaoPatrimonio}>
                <defs>
                  <linearGradient id="gPat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="mes" {...axis} />
                <YAxis {...axis} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number, n: string) => [brl(v), n === "patrimonio" ? "Patrimônio" : "Aportado"]}
                />
                <Area
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="patrimonio"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#gPat)"
                />
                <Area
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="aportado"
                  stroke="var(--color-muted-foreground)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-surface p-5 shadow-card">
          <h2 className="text-sm font-semibold">Alocação por classe</h2>
          <div className="mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alocacaoPorClasse}
                  dataKey="valor"
                  nameKey="classe"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {alocacaoPorClasse.map((_, i) => (
                    <Cell key={i} fill={donutColors[i % donutColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => brl(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-2">
            {alocacaoPorClasse.map((a, i) => (
              <li key={a.classe} className="flex items-center gap-2 text-sm">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: donutColors[i % donutColors.length] }}
                />
                <span className="text-muted-foreground">{a.classe}</span>
                <span className="ml-auto tabular-nums">{a.peso.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-border/60 bg-surface p-5 shadow-card">
        <h2 className="text-sm font-semibold">Proventos recebidos por mês</h2>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={proventosMensais}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="mes" {...axis} />
              <YAxis {...axis} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
              <Tooltip
                cursor={{ fill: "var(--color-elevated)" }}
                contentStyle={tooltipStyle}
                formatter={(v: number) => [brl(v), "Proventos"]}
              />
              <Bar dataKey="valor" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-card">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h2 className="text-sm font-semibold">Posições</h2>
          <span className="text-xs text-muted-foreground">{posicoes.length} ativos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="[&>th]:px-5 [&>th]:py-3 [&>th]:text-right [&>th:first-child]:text-left">
                <th>Ativo</th>
                <th>Qtd.</th>
                <th>Preço médio</th>
                <th>Cotação</th>
                <th>Posição</th>
                <th>Resultado</th>
                <th>DY 12m</th>
                <th>Renda/ano</th>
              </tr>
            </thead>
            <tbody>
              {posicoes.map((p) => (
                <tr
                  key={p.ticker}
                  className="border-t border-border/50 [&>td]:px-5 [&>td]:py-3 [&>td]:text-right [&>td:first-child]:text-left"
                >
                  <td>
                    <div className="font-medium">{p.ticker}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.nome} · {p.classe}
                    </div>
                  </td>
                  <td className="tabular-nums">{p.quantidade}</td>
                  <td className="tabular-nums">{brl(p.precoMedio)}</td>
                  <td className="tabular-nums">{brl(p.precoAtual)}</td>
                  <td className="tabular-nums">{brl(p.atual)}</td>
                  <td className={`tabular-nums ${p.lucro >= 0 ? "text-positive" : "text-negative"}`}>
                    {brl(p.lucro)}
                    <span className="ml-1 text-xs">({pct(p.variacao)})</span>
                  </td>
                  <td className="tabular-nums">{p.dyAno.toFixed(1)}%</td>
                  <td className="tabular-nums">{brl(p.rendaAno)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
