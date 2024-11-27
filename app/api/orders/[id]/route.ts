import { db } from '@/app/_lib/prisma';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const body = await request.json();
  const { concluded } = body;

  if (typeof concluded !== 'boolean') {
    return NextResponse.json({ error: 'O campo "concluded" é obrigatório e deve ser um booleano' }, { status: 400 });
  }

  try {
    const updatedOrder = await db.order.update({
      where: { id },
      data: { concluded },
    });
    revalidatePath("/admin/finish")

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar o pedido' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }



  try {
    const deletedOrder = await db.order.delete({
      where: { id }
    });
    
    revalidatePath("/admin/finish")

    return NextResponse.json(deletedOrder);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar o pedido' }, { status: 500 });
  }
}
