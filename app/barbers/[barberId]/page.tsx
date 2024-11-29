import { FC } from "react"
 
import { redirect } from "next/navigation"
import { validateBarber } from "@/app/_actions/validate-barber"
import { auth } from "@/app/_lib/auth"

import { Card, CardContent } from "@/app/_components/ui/card"
import Link from "next/link"
import { Button } from "@/app/_components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs"
import TimeslotsManager from "@/app/_components/Barber/TimeslotsManager"
import { db } from "@/app/_lib/prisma"
import BarberBookings from "@/app/_components/Barber/BarberBookings"
import BarberEditForm from "@/app/_components/Barber/BarberEditForm"

interface BarberPageProps {
  params: {
    barberId: string
  }
}

const BarberPage: FC<BarberPageProps> = async ({ params }) => {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }
  const BarberData = await validateBarber(session.user.email)
  if (!BarberData) {
    redirect("/")
  }
  const barberShop = await db.barbershop.findFirst()
  if (!barberShop) {
    redirect("/")
  }

  return (
    <Tabs defaultValue="bookings">
      <Card className="relative">
        <CardContent className="flex flex-row items-center justify-center p-5">
          <Link href="/" className="absolute left-5">
            <Button size="icon" variant="outline">
              <ArrowLeftIcon size={18} />
            </Button>
          </Link>
          <TabsList>
            <TabsTrigger value="bookings">Agendamentos</TabsTrigger>
            <TabsTrigger value="timeslots">Horários</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>
        </CardContent>
      </Card>

      <div className="space-y-3 p-5">
        <TabsContent value="bookings">
          <BarberBookings barberId={params.barberId} />
        </TabsContent>
        <TabsContent value="timeslots">
          <TimeslotsManager
            barberId={params.barberId}
            barbershopId={barberShop.id}
          />
        </TabsContent>
        <TabsContent value="profile">
          <BarberEditForm initialData={BarberData} />
        </TabsContent>
      </div>
    </Tabs>
  )
}

export default BarberPage
