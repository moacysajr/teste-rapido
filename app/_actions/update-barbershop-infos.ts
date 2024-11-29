
'use server'

import { auth } from "@/app/_lib/auth"
import { db } from "../_lib/prisma"
   
import { revalidatePath } from "next/cache"

export async function updateBarbershop(id: string, data: {
  name: string
  address: string
  phones: string[]
  isClosed: boolean
  description: string
  imageUrl: string
}) {
	const session = await auth()
  if (!session?.user) {
		return { success: false, error: "Usuário não autenticado" }
  }

  // Verificar se o usuário atual é um admin
  const currentUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true }
  })

  if (!currentUser?.isAdmin) {
    return { success: false, error: "Permissão negada: Apenas administradores podem realizar esta ação" }
  }
  try {
    const updatedBarbershop = await db.barbershop.update({
      where: { id },
      data
    })
    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true, barbershop: updatedBarbershop }
  } catch (error) {
    console.error('Error updating barbershop:', error)
    return { success: false, error: 'Ocorreu um erro ao atualizar as informações.' }
  }
}