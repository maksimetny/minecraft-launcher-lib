
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
                if (typeof location.path !== 'string') break;
                return new Folder(location.path);
            }
        }

        throw new Error('path is not a string');
    }

    private _path: string;

    constructor(path: string) { this._path = path; }

    join(...parts: string[]): string {
        return join(this.path, ...parts);
    }

    get path(): string {
        return this._path;
    }

    set path(path: string) {
        this._path = path;
    }

    toString(): string {
        return this._path;
    }

    toJSON(): string {
        return this.toString();
    }

}

export type Location = string | Partial<IFolder>;
