

import { db } from "./prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import { hashPassword,  } from "./bcrypt"
import Credentials from "next-auth/providers/credentials"
import { loginWhitePhone } from "../_actions/login-with-phone"
import NextAuth from "next-auth"
import { Adapter } from "next-auth/adapters"




export const { handlers, auth, signIn, signOut,  } = NextAuth({
  adapter: PrismaAdapter(db) as Adapter, 
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    
    
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        phone: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
        const  phone = credentials!.phone as string
        const  password = credentials!.password as string
 
        // logic to salt and hash password
        const pwHash = await hashPassword(password)
 
       
        // logic to verify if the user exists
        console.log("chegou na pfunção-----------------------------")
        user = await loginWhitePhone({phone, pwHash})
        console.log("Passou na pfunção-----------------------------")
 
        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.")
        }
 
        // return user object with their profile data
        return user
      },
    }),


  
  ],
  
  callbacks: {
    async signIn({ user, account }) {
      const adminEmails = ["rodrigohduarte9@gmail.com"];
      const isAdmin = adminEmails.includes(user.email as string);
  
      // Verifica se o usuário já existe no banco
      const existingUser = await db.user.findUnique({
        where: { email: user.email as string },
      });
  
      if (!existingUser) {
       
        console.log("// Se não existe, cria um novo usuário") // Se não existe, cria um novo usuário
        await db.user.create({
          data: {
            id: user.id,
            email: user.email as string,
            name: user.name,
            isAdmin: isAdmin,
          },
        });
      } else if (existingUser.id !== user.id) {
        console.log("Caso o usuário exista mas os IDs sejam diferentes (conflito entre providers)")
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
      console.log(" // Atualiza o campo `isAdmin` se necessário")
      // Atualiza o campo `isAdmin` se necessário
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
