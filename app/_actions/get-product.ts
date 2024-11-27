"use server"
import { db } from "../_lib/prisma"

export const getOrders = async () => {

    const orders = await db.order.findMany({
        include: {
          items: {
            include: {
              item: true,
            },
          },
        },
      })
        if(!orders){
          throw new Error("Não foi possível encontrar os itens")
        }

  return orders
}

