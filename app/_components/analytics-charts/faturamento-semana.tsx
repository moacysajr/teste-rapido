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

interface FaturamentoSemanaProps {
  valorAtual: string
  valorPassado: string
  porcentagem: string
}

export default function FaturamentoSemana({
  valorAtual,
  valorPassado,
  porcentagem,
}: FaturamentoSemanaProps) {
  const PorcentagemNumber = parseInt(parseFloat(porcentagem).toFixed())
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Faturamento essa semana</CardDescription>

        <CardTitle className="text-4xl">
          R${parseFloat(valorAtual).toFixed()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {PorcentagemNumber}% comparando semana passada <br />
          (R${valorPassado})
        </div>
      </CardContent>
      <CardFooter>
        <Progress value={PorcentagemNumber} />
      </CardFooter>
    </Card>
  )
}
