import { FC } from "react"
import { getAnalyticsData } from "@/app/_data/get-analytics"
import { authOptions } from "@/app/_lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { MaisPedidos } from "@/app/_components/analytics-charts/servicos-mais-pedidos"
import FaturamentoSemana from "@/app/_components/analytics-charts/faturamento-semana"
import FaturamentoMes from "@/app/_components/analytics-charts/faturamento-mes"
import ServicesNumber from "@/app/_components/analytics-charts/servicesNumber"
import { WeekDaysChart } from "@/app/_components/analytics-charts/WeekDaysChart"
import { Separator } from "@/app/_components/ui/separator"
import MediaAtendimentosPorDia from "@/app/_components/analytics-charts/media-agendamentos-dia"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card"


const page: FC = async () => {
  const session = await getServerSession(authOptions)
  const analytics = await getAnalyticsData()

  if (!session?.user) {
    // TODO: login nao funciona
    redirect("/login")
  }

  if (!session?.user.isAdmin) {
    redirect("/")
  }

  return (
    <section className="grid grid-cols-1 gap-2 lg:grid-cols-3">
       <div className="lg:col-span-3">
        <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight mt-5">Painel Analytics:</h1>
      </div>
      <div className="lg:col-span-3 mb-2">
      <Separator className="my-2" />
        <p className="scroll-m-20 text-muted-foreground text-sm">Faturamento total da barbearia:</p>
        <h1 className="scroll-m-20 pb-2 text-4xl font-semibold tracking-tight mt-2">R${parseFloat(analytics.revenue.total).toFixed()}</h1>
        <div className="text-muted-foreground">
          No total você fez{" "}
          <strong>
            {analytics.totalBookings.monthly > 1
              ? `${analytics.totalBookings.monthly} atendimentos`
              : `${analytics.totalBookings.monthly} atendimento`}
            {". "}
          </strong>
          <br />
          Uma média de <strong>R${analytics.revenue.averagePerBooking}</strong> por atendimento
        </div>
      </div>
      <MediaAtendimentosPorDia
        valorAtual={analytics.averageBookingsPerDay.thisMonth}
        valorPassado={analytics.averageBookingsPerDay.lastMonth}
        porcentagem={analytics.averageBookingsPerDay.change}
      />
      <FaturamentoSemana
        valorAtual={analytics.revenue.weekly.current}
        valorPassado={analytics.revenue.weekly.previous}
        porcentagem={analytics.revenue.weekly.change}
      />
      <FaturamentoMes
        valorAtual={analytics.revenue.monthly.current}
        valorPassado={analytics.revenue.monthly.previous}
        porcentagem={analytics.revenue.monthly.change}
      />
      <Separator className="my-3 lg:col-span-3" />
      <Card>
        <CardHeader className="p-0 px-6 pt-6 pb-3">
          <CardTitle className="text-3xl">Seus clientes:</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="scroll-m-20 text-xl font-semibold tracking-tight">Você tem {analytics.customers.total} clientes.</p>
          <p><strong>({analytics.customers.new})</ strong> novos clientes e <strong>({analytics.customers.returning})</strong> clientes recorrentes.</p>
          <p>{analytics.customers.total - analytics.customers.withPhone} clientes ainda não cadastraram o telefone.</p>
        </CardContent>
      </Card>
        <Card>
          <CardHeader className="p-0 px-6 pt-6 pb-3">
            <CardTitle className="text-3xl">Ocupação:</CardTitle>
          </CardHeader>
          <CardContent>
          <p>Taxa de ocupação</p>
          <p className="scroll-m-20 text-xl font-semibold tracking-tight">{analytics.occupancy.rate}</p>
          <p>Horários disponíveis: {analytics.occupancy.availableSlots}/{analytics.occupancy.totalSlots}</p>
          </CardContent>
        </Card>

        <Card>
        <CardHeader className="p-0 px-6 pt-6 pb-3">
          <CardTitle className="text-3xl">Dias de pico:</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Dia da semana/mês com mais atendimentos.</p>
          <p className="scroll-m-20 text-xl font-semibold tracking-tight capitalize">Semana: {analytics.peakDays.weekly}</p>
          <p className="scroll-m-20 text-xl font-semibold tracking-tight">Mês: dia {analytics.peakDays.monthly}</p>
          </CardContent>
      </Card>

      <Separator className="my-3 lg:col-span-3" />

      <ServicesNumber totalBookings={analytics.totalBookings} />
      <MaisPedidos data={analytics.services.topFive} total={analytics.services.total} />
      <WeekDaysChart
        weekdayDistribution={
          analytics.averageBookingsPerDay.weekdayDistribution
        }
      />

      <div className="lg:col-span-3">
        <h1>Datas usadas:</h1>
        <ul className="flex flex-col py-2 text-xs font-light sm:text-sm md:flex-row md:gap-2">
          <li>Hoje: {analytics.dateRanges.today} </li>
          <li>Semana atual: {analytics.dateRanges.today}</li>
          <li>Semana passada: {analytics.dateRanges.today}</li>
          <li>Mês atual: {analytics.dateRanges.today}</li>
          <li>Mês passado:{analytics.dateRanges.today}</li>
        </ul>
      </div>
    </section>
  )
}

export default page
