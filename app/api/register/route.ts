import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/app/_lib/prisma";
import { hashPassword } from '@/app/_lib/bcrypt';

interface requestProps{
phone: string,
password: string,
}

export async function POST(request: NextRequest) {

    const { phone, password } :requestProps = await request.json();
    if (!phone || !password) {
        
        return NextResponse.json({ message: 'Não foi encontrado telefone' }, { status: 400 });
        }
        const hashedPassword = await hashPassword(password);
        try {
            const user = await db.user.create({
            data: { phone, password: hashedPassword },
            });
            return NextResponse.json({ message: "User created", user },{status: 201});
            } catch (error) {
                return NextResponse.json({message:  "Não foi possivel criar a conta" },{status: 500});
            } 
  }  
