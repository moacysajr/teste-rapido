"use server"
 
import { db } from "../_lib/prisma"
import { auth } from "@/app/_lib/auth"
import { revalidatePath } from "next/cache"

export async function updateTimeSlotAvailability(id: string, isAvailable: boolean) {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Usuário não autenticado")
    }

    // Verificar se o usuário atual é um admin
    const currentUser = await db.user.findUnique({
        where: { id: session.user.id },
        select: { isAdmin: true }
    })

    if (!currentUser?.isAdmin) {
        throw new Error("Permissão negada: Apenas administradores podem realizar esta ação")
    }
  
    const updatedTimeSlot = await db.timeSlot.update({
        where: { id },
        data: { isAvailable },
    })
    revalidatePath("/admin")
    revalidatePath("/")

    return updatedTimeSlot
}