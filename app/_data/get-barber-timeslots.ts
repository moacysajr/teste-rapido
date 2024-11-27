"use server"
import { db } from "../_lib/prisma";

export async function getBarberAvailableTimeSlots(barberId: string) {
  const barbershop = await db.barbershop.findFirst()

  if (!barbershop) {
    throw new Error("Barbershop not found");
  }

  return db.timeSlot.findMany({
    where: {
      barbershopId: barbershop.id,
      barberId: barberId,
      isAvailable: true,
    },
    orderBy: {
      time: 'asc',
    },
  })
}