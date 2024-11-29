"use server"
import { auth } from "@/app/_lib/auth"
   
import { db } from "../_lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteTimeSlot(id: string) {
	const session = await auth()
  if (!session?.user) {
    return { success: false, message: "Usuário não autenticado" }
  }

  const deletedTimeSlot = db.timeSlot.delete({
    where: { id },
  })
  revalidatePath("/admin")
  revalidatePath("/")

  return deletedTimeSlot
}