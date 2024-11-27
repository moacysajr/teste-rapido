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

interface FaturamentoMesProps {
  valorAtual: string
  valorPassado: string
  porcentagem: string
}

export default function FaturamentoMes({
  valorAtual,
  valorPassado,
  porcentagem,
}: FaturamentoMesProps) {
  const PorcentagemNumber = parseInt(parseFloat(porcentagem).toFixed())
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Faturamento esse mês</CardDescription>

        <CardTitle className="text-4xl">
          R${parseFloat(valorAtual).toFixed()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {PorcentagemNumber}% comparando mês passado. <br />
          (R${valorPassado})
        </div>
      </CardContent>
      <CardFooter>
        <Progress value={PorcentagemNumber} />
      </CardFooter>
    </Card>
  )
}
