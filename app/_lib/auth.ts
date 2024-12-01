import { db } from "./prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"

import Credentials from "next-auth/providers/credentials"
import { loginWhitePhone } from "../_actions/login-with-phone"
import NextAuth from "next-auth"
import { Adapter } from "next-auth/adapters"
import { hashPassword } from "./bcrypt"




export const { handlers, auth, signIn, signOut,  } = NextAuth({
  debug:true,
  adapter: PrismaAdapter(db) as Adapter, 
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    
    
    Credentials({
      credentials: {
        phone: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.phone || !credentials?.password) {
          throw new Error("Phone and password are required");
        }
    
        const phone = credentials.phone as string
        const password = credentials.password as string
    
        // Realiza a lógica de autenticação
        const user = await loginWhitePhone({ phone, password });
    
        if (!user) {
          throw new Error("Invalid credentials.");
        }
    
        // Retorna o usuário com os campos esperados
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone || undefined, // Garante compatibilidade
          image: user.image,
          isAdmin: user.isAdmin,
        };
      },
    })

  
  ],
  
  callbacks: {
    async signIn({ user, account }) {
      const adminEmails = ["rodrigohduarte9@gmail.com"];
      const isAdmin = adminEmails.includes(user.email as string);
  
      // Verifica se o usuário já existe no banco
      const existingUser = await db.user.findFirst({
        where: {
          OR: [
            { email: user.email || undefined }, // Evita verificar null ou undefined
            { phone: user.phone || undefined }
          ]
        }
      });
  
    
      if (!existingUser) {
        let hashPasswords
       if (user.password && user.phone){
         hashPasswords = await hashPassword (user.password)
       }
       
        await db.user.create({
          data: {
            id: user.id,
            email: user.email as string || undefined,
            name: user.name,
            isAdmin: isAdmin,
            phone: user.phone || undefined,
            password: hashPasswords || undefined
          },
        });
      } else if (existingUser.id !== user.id) {
 
        // Caso o usuário exista mas os IDs sejam diferentes (conflito entre providers)
        // Vincula o novo provider ao usuário existente

        await db.account.update({
          where: { provider_providerAccountId: { 
            provider: account!.provider, 
            providerAccountId: account!.providerAccountId 
          }},
          data: { userId: existingUser.id },
        });
      }
    
      // Atualiza o campo isAdmin se necessário
      if (existingUser?.isAdmin !== isAdmin) {
        await db.user.update({
          where: { email: user.email as string },
          data: { isAdmin },
        });
      }
     
      return true;
    },
    
    async session({ session, user }) {
      session.user = {
        ...session.user,
        id: user.id,
        isAdmin: user.isAdmin,
      };
    
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
})