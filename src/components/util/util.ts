
import { readFile } from 'fs/promises';

export const readJson = async <J>(path: string, encoding: BufferEncoding = 'utf-8'): Promise<J> => JSON.parse(await readFile(path, encoding));
