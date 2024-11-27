"use client"

import {
  getAllUpcomingBarberBookings,
  getNextTenBarberBookings,
  getPastBarberBookings,
} from "@/app/_data/get-barber-bookings"
import { FC, useCallback, useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarImage } from "../ui/avatar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2 } from "lucide-react"

type BookingWithRelations = Awaited<
  ReturnType<typeof getNextTenBarberBookings>
>[0]

interface BarberBookingsProps {
  barberId: string
}

type BookingType = "next" | "upcoming" | "past"

const BarberBookings: FC<BarberBookingsProps> = ({ barberId }) => {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // TODO: usar o toggle group
  const [bookingType, setBookingType] = useState<BookingType>("next")

  const fetchBookings = useCallback(
    async (type: BookingType) => {
      setIsLoading(true)
      setBookings([])
      try {
        let result: BookingWithRelations[] = []

        switch (type) {
          case "next":
            result = await getNextTenBarberBookings(barberId)
            break
          case "upcoming":
            result = await getAllUpcomingBarberBookings(barberId)
            break
          case "past":
            result = await getPastBarberBookings(barberId)
            break
        }

        setBookings(result)
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [barberId],
  ) // barberId é a única dependência externa da função

  useEffect(() => {
    fetchBookings(bookingType)
  }, [bookingType, fetchBookings]) // Agora incluímos fetchBookings nas dependências

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={bookingType === "next" ? "default" : "outline"}
          onClick={() => setBookingType("next")}
        >
          Próximos 10
        </Button>
        <Button
          variant={bookingType === "upcoming" ? "default" : "outline"}
          onClick={() => setBookingType("upcoming")}
        >
          Todos Futuros
        </Button>
        <Button
          variant={bookingType === "past" ? "default" : "outline"}
          onClick={() => setBookingType("past")}
        >
          Anteriores
        </Button>
      </div>

      {isLoading && (
        <div className="inline-flex">
          <Loader2 className="mr-2 size-5 animate-spin" />
          <p>Carregando...</p>
        </div>
      )}

      {!isLoading && bookings.length === 0 && (
        <div>Nenhum agendamento encontrado.</div>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="min-w-[90%]">
            <CardContent className="flex justify-between p-0">
              {/* ESQUERDA */}
              <div className="flex flex-col gap-2 py-5 pl-5">
                <Badge
                  className="w-fit"
                  variant={bookingType === "past" ? "default" : "secondary"}
                >
                  {bookingType !== "past" ? "Confirmado" : "Finalizado"}
                </Badge>
                <h3 className="font-semibold">{booking.service.name}</h3>
                <h3 className="text-sm">{booking.user.name}</h3>

                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={booking.service.barbershop.imageUrl} />
                  </Avatar>
                  <p className="text-sm">{booking.service.barbershop.name}</p>
                </div>
              </div>
              {/* DIREITA */}
              <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
                <p className="text-sm capitalize">
                  {format(booking.date, "MMMM", { locale: ptBR })}
                </p>
                <p className="text-2xl">
                  {format(booking.date, "dd", { locale: ptBR })}
                </p>
                <p className="text-sm">
                  {format(booking.date, "HH:mm", { locale: ptBR })}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default BarberBookings
