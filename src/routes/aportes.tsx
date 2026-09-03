import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, StatCard } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  brl,
  metaPorClasse,
  patrimonio,
  posicoes,
  rendaMensal,
  sugerirAporte,
} from "@/lib/portfolio-data";

export const Route = createFileRoute("/aportes")({
  head: () => ({
    meta: [
      { title: "Simulador de aportes | RendaViva" },
      {
        name: "description",
        content:
          "Descubra onde aportar para reequilibrar a carteira e simule quanto tempo falta para viver de renda passiva.",
      },
      { property: "og:title", content: "Simulador de aportes | RendaViva" },
      {
        property: "og:description",
        content: "Sugestão de aporte por classe e projeção de independência financeira.",
      },
    ],
  }),
  component: Aportes,
});

function Aportes() {
  const [valor, setValor] = useState(3000);
  const [metaRenda, setMetaRenda] = useState(8000);
  const sugestoes = sugerirAporte(valor || 0);

  // Projeção simples: aportes mensais + reinvestimento a 0,75% a.m. de renda gerada
  const taxaMensal = 0.0075;
  let saldo = patrimonio;
  let meses = 0;
  while (saldo * taxaMensal < metaRenda && meses < 600) {
    saldo = saldo * (1 + taxaMensal) + (valor || 0);
    meses++;
  }
  const anos = Math.floor(meses / 12);
  const restoMeses = meses % 12;

  return (
    <AppShell
      title="Aportes e rebalanceamento"
      subtitle="Onde colocar o próximo dinheiro para chegar mais rápido na renda desejada."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Renda passiva atual" value={brl(rendaMensal)} hint="Média mensal" tone="up" />
        <StatCard label="Meta de renda" value={brl(metaRenda)} hint="Definida por você" />
        <StatCard
          label="Tempo estimado"
          value={meses >= 600 ? "+50 anos" : `${anos}a ${restoMeses}m`}
          hint={`Aportando ${brl(valor || 0)}/mês`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border/60 bg-surface p-5 shadow-card">
          <h2 className="text-sm font-semibold">Simulador</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-muted-foreground">Aporte mensal</span>
              <Input
                type="number"
                min={0}
                step={100}
                value={valor}
                onChange={(e) => setValor(Number(e.target.value))}
                className="mt-1"
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted-foreground">Renda passiva desejada</span>
              <Input
                type="number"
                min={0}
                step={500}
                value={metaRenda}
                onChange={(e) => setMetaRenda(Number(e.target.value))}
                className="mt-1"
              />
            </label>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Considerando retorno total de 0,75% ao mês com reinvestimento dos proventos, você chega a{" "}
            <span className="text-foreground">{brl(metaRenda)}</span> por mês em{" "}
            <span className="text-foreground">
              {meses >= 600 ? "mais de 50 anos" : `${anos} anos e ${restoMeses} meses`}
            </span>
            .
          </p>
        </section>

        <section className="rounded-2xl border border-border/60 bg-surface p-5 shadow-card">
          <h2 className="text-sm font-semibold">Sugestão do próximo aporte</h2>
          <ul className="mt-4 space-y-4">
            {sugestoes.map((s) => (
              <li key={s.classe}>
                <div className="flex items-center justify-between text-sm">
                  <span>{s.classe}</span>
                  <span className="tabular-nums font-medium">{brl(s.sugestao)}</span>
                </div>
                <Progress value={Math.min((s.peso / s.meta) * 100, 100)} className="mt-2 h-2" />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>
                    atual {s.peso.toFixed(1)}% · meta {s.meta}%
                  </span>
                  <span>{s.falta > 0 ? `faltam ${brl(s.falta)}` : "na meta"}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-card">
        <h2 className="border-b border-border/60 px-5 py-4 text-sm font-semibold">
          Metas por classe de ativo
        </h2>
        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(metaPorClasse).map(([classe, meta]) => {
            const atual =
              (posicoes.filter((p) => p.classe === classe).reduce((s, p) => s + p.atual, 0) /
                patrimonio) *
              100;
            return (
              <div key={classe} className="rounded-xl bg-elevated p-4">
                <p className="text-sm font-medium">{classe}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{atual.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">meta {meta}%</p>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
