"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import { Progress } from "@/app/_components/ui/progress"

interface MediaAtendimentosPorDiaProps {
  valorAtual: string
  valorPassado: string
  porcentagem: string
}

export default function MediaAtendimentosPorDia({
  valorAtual,
  valorPassado,
  porcentagem,
}: MediaAtendimentosPorDiaProps) {
  const PorcentagemNumber = parseInt(parseFloat(porcentagem).toFixed())
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Média de atendimentos por dia</CardDescription>

        <CardTitle className="text-4xl">
          {parseFloat(valorAtual)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {PorcentagemNumber}% comparando com o mês passado. <br />
          ({valorPassado})
        </div>
      </CardContent>
      <CardFooter>
        <Progress value={PorcentagemNumber} />
      </CardFooter>
    </Card>
  )
}
