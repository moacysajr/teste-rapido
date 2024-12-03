import { findOrCreateUser } from "../services/user-service";
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { db } from "./prisma"; // Certifique-se de ajustar o caminho corretamente

const ADMIN_EMAILS = ["admin@example.com", "superuser@example.com"]; // Lista de emails de admin

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  providers: [
    Credentials({
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("Missing credentials");
        }

        const { phone, password } = credentials as {
          phone: string;
          password: string;
        };

        const trimmedPhone = phone.trim();
        const trimmedPassword = password.trim();

        try {
          const user = await findOrCreateUser(trimmedPhone, trimmedPassword);

          // Se o email do usuário estiver na lista de admin, atualize para admin
          if (user.email && ADMIN_EMAILS.includes(user.email)) {
            await db.user.update({
              where: { id: user.id },
              data: { isAdmin: true },
            });

            // Atualiza o campo `isAdmin` do usuário no objeto retornado
            user.isAdmin = true;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone || undefined,
            image: user.image,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          throw new Error('error.message || An error occurred during authentication');
        }
      },
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
});
