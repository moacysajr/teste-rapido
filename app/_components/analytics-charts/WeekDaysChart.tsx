"use client"

import { Calendar } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart"

export const description = "Quantidade de atendimentos por dia da semana"

const chartConfig = {
  Atendimentos: {
    label: "Atendimentos",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface WeekDaysData {
  weekdayDistribution: Record<string, number>
}

export function WeekDaysChart({ weekdayDistribution }: WeekDaysData) {
  const chartData = [
    { day: "Segunda-feira", Atendimentos: weekdayDistribution.Monday },
    { day: "Terça-feira", Atendimentos: weekdayDistribution.Tuesday },
    { day: "Quarta-feira", Atendimentos: weekdayDistribution.Wednesday },
    { day: "Quinta-feira", Atendimentos: weekdayDistribution.Thursday },
    { day: "Sexta-feira", Atendimentos: weekdayDistribution.Friday },
    { day: "Sábado", Atendimentos: weekdayDistribution.Saturday },
    { day: "Domingo", Atendimentos: weekdayDistribution.Sunday },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atendimentos da semana</CardTitle>
        <CardDescription>Separados por dia da semana</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="Atendimentos"
              fill="var(--color-Atendimentos)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total de atendimentos dos últimos 7 dias{" "}
          <Calendar className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
