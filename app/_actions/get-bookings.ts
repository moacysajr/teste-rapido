"use server"

import { endOfDay, startOfDay } from "date-fns"
import { db } from "../_lib/prisma"
import Decimal from "decimal.js"


interface GetBookingsParams {
  date: Date
  barberId: string
}

// Define o tipo completo para os objetos retornados
export type BookingWithService = {
  id: string
  userId: string
  barberId: string
  serviceId: string
  date: Date
  createdAt: Date
  updatedAt: Date
  service: {
    id: string
    name: string
    description: string
    imageUrl: string
    price: Decimal
    duration: number
    barbershopId: string
  }
}

export const getBookings = async ({
  date,
  barberId,
}: GetBookingsParams): Promise<BookingWithService[]> => {
  const bookings = await db.booking.findMany({
    where: {
      barberId,
      date: {
        gte: startOfDay(date),
        lt: endOfDay(date),
      },
    },
    include: {
      service: true, // Inclui os dados relacionados ao serviço
    },
  })
  return bookings
}
