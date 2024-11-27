// actions/timeslot-actions.ts
"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"

export async function getBarberTimeSlots(
  barberId: string,
  page: number = 1,
  filter: "all" | "available" | "unavailable" = "all",
  order: "asc" | "desc" = "asc"
) {
  const itemsPerPage = 10
  const skip = (page - 1) * itemsPerPage

  // Construir a condição where baseada no filtro
  const whereCondition = {
    barberId,
    ...(filter === "available" ? { isAvailable: true } : {}),
    ...(filter === "unavailable" ? { isAvailable: false } : {}),
  }

  // Buscar total de registros para paginação
  const totalItems = await db.timeSlot.count({
    where: whereCondition,
  })

  // Buscar os timeslots com paginação e ordenação
  const timeSlots = await db.timeSlot.findMany({
    where: whereCondition,
    orderBy: {
      time: order,
    },
    skip,
    take: itemsPerPage,
    include: {
      barber: {
        select: {
          name: true,
        },
      },
    },
  })

  return {
    timeSlots,
    totalPages: Math.ceil(totalItems / itemsPerPage),
    currentPage: page,
  }
}

export async function toggleTimeSlotAvailability(timeSlotId: string) {
  try {
    // Primeiro, buscar o estado atual do timeSlot
    const currentTimeSlot = await db.timeSlot.findUnique({
      where: { id: timeSlotId },
    })

    if (!currentTimeSlot) {
      throw new Error("TimeSlot não encontrado")
    }

    // Atualizar para o estado oposto
    const updatedTimeSlot = await db.timeSlot.update({
      where: { id: timeSlotId },
      data: {
        isAvailable: !currentTimeSlot.isAvailable,
      },
    })

    revalidatePath("/")
    revalidatePath(`/barbers/${updatedTimeSlot.barberId}}`)
    return { success: true, data: updatedTimeSlot }
  } catch (error) {
    console.error("Erro ao atualizar timeSlot:", error)
    return { success: false, error: "Erro ao atualizar disponibilidade" }
  }
}

export async function deleteTimeSlot(timeSlotId: string) {
  try {
    const deletedSlot = await db.timeSlot.delete({
      where: { id: timeSlotId },
    })

    revalidatePath("/")
    revalidatePath(`/barbers/${deletedSlot.barberId}}`)
    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar timeSlot:", error)
    return { success: false, error: "Erro ao deletar horário" }
  }
}