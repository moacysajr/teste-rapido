/* eslint-disable no-unused-vars */
import 'next-auth';
import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    isAdmin: boolean;
    phone?: string;
    password?: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser extends DefaultUser {
    isAdmin: boolean; // Incluindo isAdmin
    phone?: string; // Outros campos opcionais
  }
}