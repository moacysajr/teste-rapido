"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"
import { revalidatePath } from "next/cache"

export async function addBarberTimeSlot(barbershopId: string, time: string, barberId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Usuário não autenticado")
  }

  // Busca o usuário atual com informações de admin e perfil de barbeiro
  const currentUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { 
      isAdmin: true,
      email: true,
      barberProfile: true
    }
  })

  if (!currentUser) {
    throw new Error("Usuário não encontrado")
  }


  // Verifica se o usuário é admin ou se é o próprio barbeiro
  const isBarber = await db.barber.findUnique({
    where: { email: currentUser.email }
  })

  const hasPermission = currentUser.isAdmin || (isBarber && isBarber.id === barberId)

  if (!hasPermission) {
    throw new Error("Permissão negada: Apenas administradores ou o próprio barbeiro podem realizar esta ação")
 }
  if (!isBarber) {
    throw new Error("barbeiro não encontrado")
 }

  const newTimeSlot = await db.timeSlot.create({
    data: {
      
      barbershopId:isBarber.barbershopId,
      time,
      barberId
    },
  })

  revalidatePath(`/barbers/${barberId}`)
  revalidatePath("/")
  return newTimeSlot
}