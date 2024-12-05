import crypto from 'crypto';


const SECRET_KEY = Buffer.from([
    244, 71, 217, 165, 34, 132, 131, 254, 86, 173, 100, 123, 87, 157,
    134, 112, 195, 141, 102, 62, 33, 100, 123, 246, 55, 247, 207, 165,
    136, 28, 194, 145
]); 
const IV = Buffer.from([
    150, 222, 116, 103, 95, 0, 0, 137, 175, 246, 69, 230, 38, 47, 148, 240
]);

// AES CTR Encryption 
export const aesEncrypt = (plaintext) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, IV);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted; 
};

// AES CTR Decryption
export const aesDecrypt = (encryptedData) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, IV);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted; 
};