"use server"

import { db } from "../_lib/prisma"

// Retorna os 10 próximos agendamentos de um barbeiro
export const getNextTenBarberBookings = async (barberId: string) => {
  try {
    return await db.booking.findMany({
      where: {
        barberId,
        date: {
          gte: new Date(),
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        service: {
          include: {
            barbershop: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
      take: 10,
    })
  } catch (error) {
    console.error("Erro ao buscar próximos agendamentos:", error)
    return []
  }
}

// Retorna todos os próximos agendamentos de um barbeiro
export const getAllUpcomingBarberBookings = async (barberId: string) => {
  try {
    return await db.booking.findMany({
      where: {
        barberId,
        date: {
          gte: new Date(),
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        service: {
          include: {
            barbershop: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    })
  } catch (error) {
    console.error("Erro ao buscar todos os próximos agendamentos:", error)
    return []
  }
}

// Retorna todos os agendamentos passados de um barbeiro
export const getPastBarberBookings = async (barberId: string) => {
  try {
    return await db.booking.findMany({
      where: {
        barberId,
        date: {
          lt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        service: {
          include: {
            barbershop: true,
          },
        },
      },
      orderBy: {
        date: "desc", // Ordenação decrescente para mostrar os mais recentes primeiro
      },
    })
  } catch (error) {
    console.error("Erro ao buscar agendamentos passados:", error)
    return []
  }
}