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
  component: Analise;
});

function Analise() {
  return <div />;
}
