"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
 
import { auth } from "@/app/_lib/auth"
import { sendMessage } from "./send-message"

interface CreateBookingParams {
  serviceId: string
  date: Date,
  barberId:string
}

export const createBooking = async (params: CreateBookingParams) => {
  const session = await auth()
  if (!session || !session.user.id) {
    throw new Error("Usuário não autenticado")
  }
  
  const booking = await db.booking.create({
    data: { ...params, userId: session.user.id },
  })
  
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { phone: true }
  })
  
  const service = await db.barbershopService.findUnique({
    where: { id: params.serviceId },
    select: {
      name: true,
      price:true,
      barbershop: {
        select: {
          phones: true,
          name:true,
          
        },
      },
    },
  })

  const barber = await db.barber.findUnique({
    where: { id: params.barberId },
    select: { name: true },
  })
  
  const sendNotifications = async () => {
    // Notificação para o barbeiro
    if (service?.barbershop?.phones && service.barbershop.phones.length > 0) {
      const telefonebarbeiro = service.barbershop.phones[0]

      
      const linha1 = "*Agenda Pronta informa:*";
      const linha2 = `${barber?.name?.split(" ")[0]}, Passando apenas para lembrar você do seu agendamento:`
      const linha3 = `*Data:* ${params.date.toLocaleString()}`;
     
      const linha5 = `*Profissional:* ${barber?.name}`
      const linha6 = `*Serviço:* ${service.name}` 
      const linha7 = `*Valor:* R$ ${service.price}`

      const mensagembarber = linha1 + "%0A"  + "%0A" + linha2 + "%0A" + "%0A" + linha3 +"%0A" + linha5 +"%0A"+ linha6 +"%0A"+ linha7  ;
      


      await sendMessage(telefonebarbeiro, mensagembarber)
      console.log(`Mensagem enviada para o telefone ${telefonebarbeiro}`)
    }

    // Notificação para o cliente
    if (user?.phone && service) {
      
      const linha1 = "*Agenda Pronta informa:*";
      const linha2 = `${session.user.name?.split(" ")[0]}, Passando apenas para lembrar você do seu agendamento:`
      const linha3 = `*Data:* ${params.date.toLocaleString()}`;
      const linha4 = `*Local:* ${service.barbershop.name}`
      const linha5 = `*Profissional:* ${barber?.name}`
      const linha6 = `*Serviço:* ${service.name}` 
      const linha7 = `*Valor:* R$ ${service.price}`


      const linha8 = "Aguardamos você! %0A %0A(não responda essa mensagem ) "
      

      const mensagemCliente = linha1 + "%0A"  + "%0A" + linha2 + "%0A" + "%0A" + linha3 +"%0A" + linha4 +"%0A"+ linha5 +"%0A"+ linha6 +"%0A"+ linha7 + "%0A%0A"+ linha8 ;
      

      



      await sendMessage(user.phone, mensagemCliente)
      console.log(`Mensagem enviada para o telefone do cliente ${user.phone}`)
    }
  }
  



  
  await sendNotifications()

  revalidatePath("/")
  revalidatePath("/bookings")
  revalidatePath("/admin")
  revalidatePath("/admin/bookings")

  return booking
}