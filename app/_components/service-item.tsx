"use client"

import {
  Barbershop,
  BarbershopService,

} from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import {
  isToday,
  set,
  parse,
  format,
  areIntervalsOverlapping,
  addMinutes
} from "date-fns"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useMemo, useState } from "react"
import { createBooking } from "../_actions/create-booking"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { BookingWithService, getBookings } from "../_actions/get-bookings"
import { Dialog, DialogContent } from "./ui/dialog"
import SignInDialog from "./sign-in-dialog"
import BookingSummary from "./booking-summary"
import { useRouter } from "next/navigation"
import { Skeleton } from "./ui/skeleton"
import { getBarberAvailableTimeSlots } from "../_data/get-barber-timeslots"
import { Clock } from "lucide-react"

interface Barber {
  id: string
  name: string
  imageUrl: string
}

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
  isClosed: boolean
}

type TimeSlot = {
  id: string;
  time: string;
  barbershopId: string;
  barberId: string;
  createdAt: Date;
  updatedAt: Date;
};

/*interface Booking {
  date: Date;
  barberId: string;
  duration: number;
  service: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: Decimal;
    duration: number;
    barbershopId: string;
};
  
};
*/

type GetTimeListProps = {
  bookings: BookingWithService[];
  selectedDay: Date;
  timeSlots: TimeSlot[];
  serviceDuration: number;
};

const getTimeList = ({ bookings, selectedDay, timeSlots, serviceDuration }: GetTimeListProps) => {
  const now = new Date()
  return timeSlots.map((timeSlot) => {
     // Converter o horário do slot para um objeto Date
     const slotTime = parse(timeSlot.time, 'HH:mm', selectedDay);

      // Verificar se o horário já passou (apenas para hoje)
      const isPastTime = isToday(selectedDay) ? slotTime <= now : false

      // Criar intervalo para o slot atual considerando a duração do serviço
      const slotInterval = {
        start: slotTime,
        end: addMinutes(slotTime, serviceDuration),
      };

      // Verificar conflitos com reservas existentes
      const hasConflict = bookings.some((booking) => {
        const bookingInterval = {
          start: booking.date,
          end: addMinutes(booking.date, booking.service.duration),
        };

        return areIntervalsOverlapping(slotInterval, bookingInterval, {
          inclusive: false,
        });
      });
      // Console log incremental para verificar booking, hasConflict e data formatada
      bookings.forEach((booking) => {
        console.log(
          `Booking Start: ${format(booking.date, 'dd HH:mm', { locale: ptBR })}, 
          Booking End: ${format(addMinutes(booking.date, serviceDuration), 'dd HH:mm', { locale: ptBR })}, 
          Slot Start: ${format(slotInterval.start, 'dd HH:mm', { locale: ptBR })}, 
          Slot End: ${format(slotInterval.end, 'dd HH:mm', { locale: ptBR })}, 
          hasConflict: ${hasConflict}`
        );
      });

      return {
        ...timeSlot,
        isAvailable: !isPastTime && !hasConflict,
        hasConflict,
      }
    })
    .filter((timeSlot) => timeSlot.isAvailable) // Filtrar apenas horários disponíveis
  }

const ServiceItem = ({ service, barbershop, isClosed }: ServiceItemProps) => {
  const { data } = useSession()
  const router = useRouter()
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
 const [selectedBarber, setSelectedBarber] = useState<string | undefined>(undefined)
 const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [dayBookings, setDayBookings] = useState<BookingWithService[]>([])
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)
  const [isLoadingBarber, setIsLoadingBarber] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [barbers, setBarbers] = useState<Barber[]>([])

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedBarber || !selectedDay) return

      setIsLoadingTimeSlots(true)
      try {
        const slots = await getBarberAvailableTimeSlots(selectedBarber)
        setTimeSlots(slots)
      } catch (error) {
        console.error("Failed to fetch time slots:", error)
        toast.error("Erro ao carregar horários disponíveis")
      } finally {
        setIsLoadingTimeSlots(false)
      }
    }

    fetchTimeSlots()
  }, [selectedBarber, selectedDay])

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay || !selectedBarber) return
      const bookings = await getBookings({
        date: selectedDay,
        barberId: selectedBarber,
      })
      if(!bookings){
        setDayBookings([])
      }
      setDayBookings(bookings)
    }
    fetch()
  }, [selectedDay, selectedBarber])

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return
    const [hours, minutes] = selectedTime.split(":").map(Number)
    return set(selectedDay, { hours, minutes, seconds: 0, milliseconds: 0 })
  }, [selectedDay, selectedTime])

  const handleBookingClick = () => {
    if (data?.user) {
      return setBookingSheetIsOpen(true)
    }
    return setSignInDialogIsOpen(true)
  }

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined)
    setSelectedTime(undefined)
    setSelectedBarber(undefined)
    setDayBookings([])
    setBookingSheetIsOpen(false)
  }

  const handleDateSelect = async (date: Date | undefined) => {
    setSelectedDay(date)

    if (date) {
      setIsLoadingBarber(true)

      try {
        const response = await fetch("/api/barbers")

        const barbersData = await response.json()
        setBarbers(barbersData)
      } catch (error) {
        console.error("Erro ao carregar barbeiros:", error)
        toast.error("Erro ao carregar barbeiros disponíveis")
      } finally {
        setIsLoadingBarber(false)
      }
    }

    setSelectedBarber(undefined)
    setSelectedTime(undefined)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = async () => {
    setIsLoading(true)
    try {
      if (!selectedDate || !selectedBarber) return
      await createBooking({
        serviceId: service.id,
        date: selectedDate,
        barberId: selectedBarber,
      })
      handleBookingSheetOpenChange()
      toast.success("Reserva criada com sucesso!", {
        action: {
          label: "Ver agendamentos",
          onClick: () => router.push("/bookings"),
        },
      })
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar reserva!")
    } finally {
      setIsLoading(false)
    }
  }

  const timeList = useMemo(() => {
    if (!selectedDay) return []
    return getTimeList({
      bookings: dayBookings,
      selectedDay,
      timeSlots,
      serviceDuration: service.duration
    })
  }, [dayBookings, selectedDay, timeSlots, service.duration])

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          {/* IMAGE */}
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              alt={service.name}
              src={service.imageUrl}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          {/* DIREITA */}
          <div className="w-full space-y-2">
            <h3 className="text-sm inline-flex flex-col gap-2 items-start font-semibold">{service.name} <span className="inline-flex font-normal items-center gap-1 text-xs"> <Clock className="size-4  text-muted-foreground "/>{service.duration} minutos </span></h3>
            <p className="text-sm text-gray-400">{service.description}</p>
            {/* PREÇO E BOTÃO */}
            <div className="flex flex-row items-center justify-between sm:flex-col sm:items-start lg:flex-row lg:items-center">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>

              <Sheet
                open={bookingSheetIsOpen}
                onOpenChange={handleBookingSheetOpenChange}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBookingClick}
                  disabled={isClosed}
                >
                  Reservar
                </Button>

                <SheetContent className="overflow-y-auto px-10">
                  <SheetHeader>
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="border-b border-solid py-5">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      selected={selectedDay}
                      onSelect={handleDateSelect}
                      fromDate={new Date()}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>

                  {selectedDay && (
                    <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                      {isLoadingBarber ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <Skeleton
                            key={index}
                            className="h-10 w-16 rounded-full"
                          />
                        ))
                      ) : barbers.length > 0 ? (
                        barbers.map((barber) => (
                          <Button
                            key={barber.id}
                            variant={
                              selectedBarber === barber.id
                                ? "default"
                                : "outline"
                            }
                            className="rounded-full"
                            onClick={() => {
                              setSelectedBarber(barber.id)
                             }}
                          >
                            {barber.name}
                          </Button>
                        ))
                      ) : (
                        <p className="text-xs">
                          Não há barbeiros disponíveis para este dia.
                        </p>
                      )}
                    </div>
                  )}

                  {selectedDay && selectedBarber && (
                    <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                      {isLoadingTimeSlots ? (
                        // Skeleton loading
                        Array.from({ length: 5 }).map((_, index) => (
                          <Skeleton
                            key={index}
                            className="h-10 w-16 rounded-full"
                          />
                        ))
                      ) : timeList.length > 0 ? (
                        timeList.map((timeSlot) => (
                                                    <Button
                            key={timeSlot.id}
                            variant={
                              selectedTime === timeSlot.time
                                ? "default"
                                : "outline"
                            }
                            className="rounded-full"
                            onClick={() => handleTimeSelect(timeSlot.time)}
                          >
                            {timeSlot.time}
                          </Button>
                        ))
                      ) : (
                        <p className="text-xs">
                          Não há horários disponíveis para este dia.
                        </p>
                      )}
                    </div>
                  )}
                  {selectedDate && (
                    <div className="p-5">
                      <BookingSummary
                        barbershop={barbershop}
                        service={service}
                        selectedDate={selectedDate}
                      />
                    </div>
                  )}
                  <SheetFooter className="mt-5 px-5">
                    <Button
                      onClick={handleCreateBooking}
                      disabled={
                        !selectedDay ||
                        !selectedTime ||
                        !selectedBarber ||
                        isLoading
                      }
                    >
                      {isLoading ? <span>Carregando...</span> : "Confirmar"}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItem