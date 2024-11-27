"use server";

import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";
import Decimal from "decimal.js";

interface CartItem {
  id: string;
  quantity: number;
  price: string; // Alterado para string, conforme esperado pelo Prisma
}

export async function createOrder(cart: CartItem[]) {
  if (cart.length === 0) {
    return { success: false, error: "O carrinho está vazio." };
  }

  try {
    // Calcular o total do pedido usando Decimal.js
    const totalAmount = cart.reduce(
      (total, item) =>
        total.plus(new Decimal(item.price).mul(item.quantity)),
      new Decimal(0)
    );

    // Criar a ordem no banco de dados
    const order = await db.order.create({
      data: {
        totalPrice: totalAmount.toNumber(),
        items: {
          create: cart.map((item) => ({
            quantity: item.quantity,
            item: {
              connect: {
                id: item.id,
              },
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    revalidatePath("/admin/finish");
    return { success: true, data: order };
  } catch (error) {
    console.error("[CREATE_ORDER]", error);
    return { success: false, error: "Falha ao criar o pedido." };
  }
}
