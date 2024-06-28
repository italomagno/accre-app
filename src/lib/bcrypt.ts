import bcrypt from 'bcrypt';

const saltRounds = 10;

// Assume 'cpf' is the CPF number you got from the user
let cpf = '123.456.789-00';
export function hashCredential(credential: string): string {
  return bcrypt.hashSync(credential, saltRounds);
}

export function compareCredential(credential: string, hash: string): boolean {
  return bcrypt.compareSync(credential, hash);
}