"use server"
import { revalidatePath } from 'next/cache'
import { db } from '../_lib/prisma';

export async function createBarberFromUser(
  email: string,
  barbershopId: string
): Promise<{ success: boolean; message: string; barber?: any }> {
  try {
    // Get plan from environment variable, default to "FREE"
    const plan = process.env.PLANO?.toUpperCase() || "FREE";
    
    // Verificar se o usuário existe
    const existingUser = await db.user.findUnique({
      where: {
        email: email,
      },
    })

    if (!existingUser) {
      return {
        success: false,
        message: 'Usuário não encontrado com este email.',
      }
    }

    // Verificar se já existe um barbeiro com este email
    const existingBarber = await db.barber.findUnique({
      where: {
        email: email,
      },
    })

    if (existingBarber) {
      return {
        success: false,
        message: 'Já existe um barbeiro cadastrado com este email.',
      }
    }

    // Verificar se o barbershop existe
    const barbershop = await db.barbershop.findUnique({
      where: {
        id: barbershopId,
      },
    })

    if (!barbershop) {
      return {
        success: false,
        message: 'Barbearia não encontrada.',
      }
    }

    // Verificar limite de barbeiros no plano FREE
    if (plan === "FREE") {
      const barberCount = await db.barber.count({
        where: {
          barbershopId: barbershopId
        }
      });

      if (barberCount >= 4) {
        return {
          success: false,
          message: 'Limite de barbeiros atingido para o plano FREE. Faça upgrade para adicionar mais barbeiros.',
        }
      }
    }

    // Criar novo barbeiro
    const newBarber = await db.barber.create({
      data: {
        name: existingUser.name || 'Nome não informado', // Usando o nome do usuário ou um valor padrão
        email: existingUser.email!,
        imageUrl: existingUser.image || null,
        barbershopId: barbershopId,
      },
    })

    revalidatePath('/') 
    revalidatePath('/admin') 

    return {
      success: true,
      message: 'Barbeiro criado com sucesso!',
      barber: newBarber,
    }
  } catch (error) {
    console.error('Erro ao criar barbeiro:', error)
    return {
      success: false,
      message: 'Erro ao criar barbeiro. Por favor, tente novamente.',
    }
  } finally {
    await db.$disconnect()
  }
}