import { db } from '../_lib/prisma'; // Ajuste conforme necessário
import { addMinutes, isBefore, isEqual } from 'date-fns';

export async function getAvailableTimeSlots(barberId: string, date: Date, duration: number) {
  // Busca agendamentos do barbeiro no dia especificado
  const bookings = await db.booking.findMany({
    where: {
      barberId,
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)), // Início do dia
        lt: new Date(date.setHours(23, 59, 59, 999)), // Final do dia
      },
    },
    select: {
      date: true,
      service: { select: { duration: true } },
    },
  });

  // Calcula horários ocupados com base na duração dos serviços
  const occupiedTimeSlots = bookings.flatMap((booking) => {
    const start = new Date(booking.date);
    const end = addMinutes(start, booking.service.duration);
    const occupied = [];
    let current = start;
    while (isBefore(current, end)) {
      occupied.push(current.toISOString());
      current = addMinutes(current, 1); // Incrementa 1 minuto
    }
    return occupied;
  });

  // Busca os horários disponíveis do barbeiro
  const barberSchedule = await db.barberSchedule.findMany({
    where: { barberId },
    select: { startTime: true, endTime: true },
  });

  if (barberSchedule.length === 0) {
    throw new Error('Barbeiro não possui horários definidos.');
  }

  // Gera a lista completa de horários disponíveis no dia
  const allTimeSlots = barberSchedule.flatMap((schedule) => {
    const startTime = new Date(`${date.toISOString().split('T')[0]}T${schedule.startTime}:00`);
    const endTime = new Date(`${date.toISOString().split('T')[0]}T${schedule.endTime}:00`);
    const slots = [];
    let current = startTime;
    while (isBefore(current, endTime)) {
      slots.push(current.toISOString());
      current = addMinutes(current, duration); // Incrementa pelo intervalo do serviço
    }
    return slots;
  });

  // Filtra horários que não conflitam com os horários ocupados
  const availableTimeSlots = allTimeSlots.filter((slot) => {
    const start = new Date(slot);
    const end = addMinutes(start, duration);
    return !occupiedTimeSlots.some((occupied) => {
      const occupiedStart = new Date(occupied);
      const occupiedEnd = addMinutes(occupiedStart, duration);
      return (
        (isEqual(start, occupiedStart) || isBefore(start, occupiedEnd)) &&
        isBefore(occupiedStart, end)
      );
    });
  });

  return availableTimeSlots;
}
