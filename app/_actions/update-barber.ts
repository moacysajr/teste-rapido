"use server"

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";

export async function updateBarber(barberId: string, data: {
  name: string;
  email: string;
  imageUrl?: string | null;
  bio?: string | null;
}) {
  try {
    // Verifica se o email já existe para outro barbeiro
    if (data.email) {
      const existingBarber = await db.barber.findFirst({
        where: {
          AND: [
            { email: data.email },
            { id: { not: barberId } }
          ]
        }
      });

      if (existingBarber) {
        throw new Error("Email já está em uso por outro barbeiro");
      }
    }

    const updatedBarber = await db.barber.update({
      where: {
        id: barberId,
      },
      data: {
        name: data.name,
        email: data.email,
        imageUrl: data.imageUrl,
        bio: data.bio,
      },
    });

    revalidatePath('/barber/profile');
    revalidatePath(`/barber/${barberId}`);

    return { success: true, data: updatedBarber };
  } catch (error) {
    console.error("[BARBER_UPDATE_ERROR]", error);
    throw new Error("Erro ao atualizar perfil do barbeiro");
  }
}