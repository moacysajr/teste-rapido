import argon2 from "argon2";

// Função para hashear a senha
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id, // Usa o Argon2id
  });
}

// Função para verificar a senha
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, password);
}
