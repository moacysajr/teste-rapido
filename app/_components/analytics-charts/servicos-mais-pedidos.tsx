"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

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

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))"
]

interface ServicosProps {
  data: {
    name: string;
    bookings: number;
  }[];
  total: number;
}

export function MaisPedidos({ data, total }: ServicosProps) {
  // Preparar dados para o gráfico
  const chartData = React.useMemo(() => {
    return data.map((service, index) => ({
      name: service.name,
      bookings: service.bookings,
      fill: CHART_COLORS[index % CHART_COLORS.length]
    }))
  }, [data])

  // Criar configuração dinâmica do gráfico
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      bookings: {
        label: "Agendamentos",
      }
    }

    data.forEach((service, index) => {
      config[service.name] = {
        label: service.name,
        color: CHART_COLORS[index % CHART_COLORS.length]
      }
    })

    return config
  }, [data])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Serviços mais pedidos do mês</CardTitle>
        <CardDescription>Top 5 serviços</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="bookings"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Mostrando os 5 serviços mais agendados
        </div>
      </CardFooter>
    </Card>
  )
}