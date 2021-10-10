
import { join } from 'path';

export interface IFolder {
    root: string;
}

export class Folder implements IFolder {

    static from(location: Location): Folder {
        if (location instanceof Folder) return location;

        switch (typeof location) {
            case 'string': return new Folder(location);
            case 'object': {
                if (location.root) return new Folder(location.root);
            }
        }

        throw new Error('missing folder path');
    }

    constructor(public root: string) { }

    join(...parts: string[]): string {
        return join(this.root, ...parts);
    }

    toString(): string {
        return this.root;
    }

    toJSON(): string {
        return this.root;
    }

}

export type Location = string | Partial<IFolder>;
