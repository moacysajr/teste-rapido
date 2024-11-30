import {  verifyPassword } from "../_lib/bcrypt";
import { db } from "../_lib/prisma";

export const loginWhitePhone = async ({ phone, password }: { phone: string; password: string }) => {
    const user = await db.user.findUnique({ where: { phone } });
    
    if (user) {
     

        if (await verifyPassword(user.password!, password)) {
            
            return user;
        } else {
            throw new Error("Invalid credentials.");
        }
    }

   // Cria um novo usuário com a senha hasheada
   
  
   
   
    
};


