// utils/encryption.js

// Function to encrypt a message using Caesar cipher
export const caesarEncrypt = (text, shift) => {
    return text.split('').map(char => {
        // Check if the character is a letter
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const base = (code >= 65 && code <= 90) ? 65 : 97; // Uppercase or lowercase
            return String.fromCharCode(((code - base + shift) % 26) + base);
        }
        return char; // Non-letter characters are not changed
    }).join('');
};

// Function to decrypt a message using Caesar cipher
export const caesarDecrypt = (encryptedText, shift) => {
    return caesarEncrypt(encryptedText, 26 - shift); // Decrypting is shifting in the opposite direction
};
    