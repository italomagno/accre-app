
import {genSaltSync,hashSync,compareSync} from 'bcrypt-ts';

const saltRounds = 10;

// Assume 'cpf' is the CPF number you got from the user
let cpf = '123.456.789-00';
export function hashCredential(credential: string): string {
    const saltedCredential = genSaltSync(saltRounds);
  return hashSync(credential, saltedCredential);
}

export function compareCredential(credential: string, hash: string): boolean {
  return compareSync(credential, hash);
}