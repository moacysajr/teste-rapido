"use server";
import { auth } from "@/app/_lib/auth"
 ;
import { revalidatePath } from "next/cache";
   ;
import { db } from "../_lib/prisma";

export async function deleteBarber(id: string) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, message: "Usuário não autenticado" };
  }

  try {
    const deletedBarber = await db.barber.delete({
      where: { id },
    });

    // Revalida caminhos que precisam ser atualizados após a exclusão
    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, data: deletedBarber };
  } catch (error) {
    console.error("Erro ao excluir barbeiro:", error);
    return { success: false, message: "Erro ao excluir barbeiro" };
  }
}
