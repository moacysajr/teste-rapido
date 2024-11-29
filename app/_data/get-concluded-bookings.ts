"use server"

 
import { db } from "../_lib/prisma"
import { auth } from "@/app/_lib/auth"

export const getConcludedBookings = async () => {
  const session = await auth()
  if (!session?.user) return []
  return db.booking.findMany({
    where: {
      userId: (session.user as any).id,
      date: {
        lt: new Date(),
      },
    },
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })
}
