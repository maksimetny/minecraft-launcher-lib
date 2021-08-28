
import { join } from 'path';

export interface IFolder {
    path: string;
}

export class Folder implements IFolder {

    static from(location: Location): Folder {
        if (location instanceof Folder) return location;

        switch (typeof location) {
            case 'string': return new Folder(location);
            case 'object': {
                if (location.path) return new Folder(location.path);
                throw new Error('missing folder path');
            }
        }
    }

    constructor(public path: string) { }

    join(...parts: string[]): string {
        return join(this.path, ...parts);
    }

    toString(): string {
        return this.path;
    }

    toJSON(): string {
        return this.path;
    }

}

export type Location = string | Partial<IFolder>;
