
import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET() {
  try {
   
    
    const barbers = await db.barber.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
      }
    })

   
    return NextResponse.json(barbers)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao buscar barbeiros disponíveis" },
      { status: 500 }
    )
  }
}