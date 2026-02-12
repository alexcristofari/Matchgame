import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = Buffer.from(process.env.CHAT_ENCRYPTION_KEY || '', 'hex');
const IV_LENGTH = 16; // AES requires 16 bytes IV

if (ENCRYPTION_KEY.length !== 32) {
    console.error(`ERROR: CHAT_ENCRYPTION_KEY must be 32 bytes! Current length: ${ENCRYPTION_KEY.length}`);
}

export const encryption = {
    encrypt: (text: string): string => {
        if (!process.env.CHAT_ENCRYPTION_KEY) return text; // Fallback for dev (should warn)

        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        // Return IV:EncryptedContent
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    },

    decrypt: (text: string): string => {
        if (!process.env.CHAT_ENCRYPTION_KEY || !text.includes(':')) return text;

        const [ivHex, encryptedHex] = text.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedText = Buffer.from(encryptedHex, 'hex');

        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }
};
