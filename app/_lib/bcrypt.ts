import argon2 from "argon2";


// Função para verificar a senha
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  // Verifica se a hash tem o formato correto de Argon2
  if (!hash.startsWith('$argon2')) {
    throw new Error('Invalid hash format');
  }

  return await argon2.verify(hash, password);
}
// Função para hashear a senha
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id, // Usa o Argon2id
  });
}
