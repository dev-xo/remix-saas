import crypto from 'crypto';

/**
 * Utils.
 * @required Template code.
 */
const ENCRYPTION_KEY = crypto.scryptSync(
	process.env.ENCRYPTION_SECRET,
	'salt',
	32,
);

const ALGORITHM = 'aes-256-ctr';
const IV_LENGTH = 16;

export const encrypt = (text: string) => {
	const iv = crypto.randomBytes(IV_LENGTH);
	const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
	const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
	return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decrypt = (text: string) => {
	const [ivPart, encryptedPart] = text.split(':');
	if (!ivPart || !encryptedPart) throw new Error('Invalid text.');

	const iv = Buffer.from(ivPart, 'hex');
	const encryptedText = Buffer.from(encryptedPart, 'hex');
	const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
	const decrypted = Buffer.concat([
		decipher.update(encryptedText),
		decipher.final(),
	]);
	return decrypted.toString();
};
