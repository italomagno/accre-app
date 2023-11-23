import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY_CRYPTO || ""
const iv = crypto.randomBytes(16);

interface EncryptedData {
  iv: string;
  content: string;
}
if (!secretKey || secretKey.length !== 64) {
  throw new Error('Invalid secret key. Key must be 64 bytes long.');
}

export const encrypt = (text: string): EncryptedData => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

export const decrypt = (hash: EncryptedData): string => {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(hash.iv, 'hex'));

  let decrypted = decipher.update(Buffer.from(hash.content, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};