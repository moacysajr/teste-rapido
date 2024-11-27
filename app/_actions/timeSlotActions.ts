'use server'

import { db } from '../_lib/prisma'

export async function checkScheduledServices(timeSlotId: string): Promise<string[]> {
  const timeSlot = await db.timeSlot.findUnique({
    where: { id: timeSlotId },
    include: {
      barbershop: {
        include: {
          services: {
            include: {
              bookings: {
                where: {
                  date: {
                    gte: new Date(),
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!timeSlot) return [];

  const scheduledServices: string[] = [];

  timeSlot.barbershop.services.forEach(service => {
    service.bookings.forEach(booking => {
      if (booking.date.toTimeString().startsWith(timeSlot.time)) {
        scheduledServices.push(`${service.name} - ${booking.date.toLocaleString()}`);
      }
    });
  });

  return scheduledServices;
}

export async function deleteTimeSlot(id: string) {
  await db.timeSlot.delete({ where: { id } });
}

export async function updateTimeSlotAvailability(id: string, isAvailable: boolean) {
  await db.timeSlot.update({ 
    where: { id }, 
    data: { isAvailable } 
  });
}

export async function getAllBarberTimeSlots(barbershopId: string, barberId: string) {
  return db.timeSlot.findMany({
    where: { barbershopId, barberId},
    orderBy: { time: 'asc' }
  });
}