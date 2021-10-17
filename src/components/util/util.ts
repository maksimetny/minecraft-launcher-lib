
import { constants } from 'fs';
import { readFile, access } from 'fs/promises';
import { createHash } from 'crypto';

export const readJson = async <J>(path: string, encoding: BufferEncoding = 'utf-8'): Promise<J> => JSON.parse(await readFile(path, encoding));

export async function calculateHash(path: string, algorithm = 'sha1'): Promise<string> {
    return createHash(algorithm)
        .update(await readFile(path))
        .digest('hex');
}

export const exists = (path: string): Promise<boolean> => access(path, constants.F_OK).then(() => true, () => false);
