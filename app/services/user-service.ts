// Certifique-se de apontar para o arquivo correto
import { db } from "../_lib/prisma";
import { hashPassword, verifyPassword } from "../_lib/bcrypt"; // Onde você implementou as funções Argon2

export async function findOrCreateUser(phone: string, password: string) {
  let user = await db.user.findUnique({
    where: { phone },
  });

  if (!user) {
    const hashedPassword = await hashPassword(password);
    user = await db.user.create({
      data: {
        phone,
        password: hashedPassword,
        name: "Novo Usuário",
      },
    });
  } else {
    const isValidPassword = await verifyPassword(user.password!, password);
    if (!isValidPassword) {
      throw new Error("Invalid phone or password.");
    }
  }

  return user;
}
