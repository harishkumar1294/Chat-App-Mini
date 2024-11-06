import crypto from 'crypto';

// Use a secure, randomly generated key and initialization vector (IV)
const encryptionKey = process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key'; // 32 chars for AES-256

// Encrypts text
export function encrypt(text) {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`; // Store iv with encrypted data
}

// Decrypts text
export function decrypt(text) {
    const [ivText, encryptedText] = text.split(':');
    const iv = Buffer.from(ivText, 'hex');
    const encryptedData = Buffer.from(encryptedText, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
