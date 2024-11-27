"use server"
import { db } from "../_lib/prisma"

export const getBarbers = async (barbershopId: string) => {

    const barbers = await db.barber.findMany({where: { barbershopId} });
        if(!barbers){
          throw new Error("Não foi possível encontrar os barbeiros")
        }

  return barbers
}
