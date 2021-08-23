
import { readFile } from 'fs';
import { promisify } from 'util';

export const read = promisify(readFile);
export const readJson = async <J>(path: string, encoding = 'utf-8'): Promise<J> => JSON.parse(await read(path, encoding));
