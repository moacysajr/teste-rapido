import { FC } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"

interface ServicesNumberProps {
  totalBookings: { daily: number; weekly: number; monthly: number }
}

const ServicesNumber: FC<ServicesNumberProps> = ({ totalBookings }) => {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Total de serviços:
        </CardTitle>
        <CardDescription className="text-sm">
          Quantidade de serviços marcados durante o mês:
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-accent p-3">
          <h1 className="font-medium text-accent-foreground">Hoje:</h1>
          <p className="text-xl font-semibold text-accent-foreground">{totalBookings.daily}</p>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-accent p-3">
          <h1 className="font-medium text-accent-foreground">Essa semana:</h1>
          <p className="text-xl font-semibold text-accent-foreground">{totalBookings.weekly}</p>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-accent p-3">
          <h1 className="font-medium text-accent-foreground">Esse mês:</h1>
          <p className="text-xl font-semibold text-accent-foreground">{totalBookings.monthly}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServicesNumber