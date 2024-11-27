"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"

interface TotalRevenueProps {
  valor: string
  bookingsQuantity: number
  averagePerBooking: string
}

export default function TotalRevenue({
  valor,
  bookingsQuantity,
  averagePerBooking,
}: TotalRevenueProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Faturamento do mês</CardDescription>
        <CardTitle className="text-4xl">
          R${parseFloat(valor).toFixed()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground">
          No total você fez{" "}
          <strong>
            {bookingsQuantity > 1
              ? `${bookingsQuantity} atendimentos`
              : `${bookingsQuantity} atendimento`}
            {". "}
          </strong>
          <br />
          Uma média de <strong>R${averagePerBooking}</strong> por atendimento
        </div>
      </CardContent>
    </Card>
  )
}
