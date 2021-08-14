
import {
    join,
} from 'path';

export interface IFolder {
    path: string;
}

export class Folder implements IFolder {

    constructor(private _path: string) { }

    getPathTo(...parts: string[]): string {
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
