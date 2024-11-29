import { verifyPassword } from "../_lib/bcrypt";
import { db } from "../_lib/prisma";

export const loginWhitePhone = async ({ phone, pwHash }: { phone: string; pwHash: string }) => {
    const user = await db.user.findUnique({ where: { phone } });
    
    if (user) {
        console.log(JSON.stringify(user))
        console.log("\n------------------------------")
        console.log(pwHash)
        console.log("\n------------------------------")
        // Verifica a senha apenas se o usuário já existir
        if (await verifyPassword(pwHash, user.password!)) {
            console.log("Senha verificada, usuário encontrado.");
            return user;
        } else {
            console.error("Senha inválida.");
            throw new Error("Invalid credentials."); // Erro se a senha estiver errada
        }
    }

    // Se não encontrar o usuário, cria um novo
    const newUser = await db.user.create({
        data: {
            phone,
            password: pwHash,
        },
    });

    console.log("Novo usuário criado.");
    return newUser;
};


