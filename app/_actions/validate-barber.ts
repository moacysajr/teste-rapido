import { db } from "../_lib/prisma";

type Barber = {
  id: string;
  name: string;
  email: string;
  imageUrl: string | null;
  bio: string | null;
  barbershopId: string;
  createdAt: Date;
  updatedAt: Date;
};

export function findBarberByEmail(barbers: Barber[], userEmail: string): string | null {
  const barber = barbers.find(barber => barber.email === userEmail);
  return barber ? barber.id : null;
}

export async function validateBarber(userEmail: string | null | undefined) {
  
  if(!userEmail){
    return false
  }

	const Barber = await db.barber.findUnique({
		where: {
			email: userEmail
		}
	});

	if(!Barber){
		return null
	}

	return Barber
}