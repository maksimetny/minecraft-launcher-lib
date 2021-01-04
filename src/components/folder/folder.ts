
import {
    join,
} from 'path'

export interface IFolder {
    path: string
}

export class Folder implements IFolder {

    constructor(private _path: string) { }

    getPathTo(...parts: string[]) {
        return join(this.path, ...parts)
    }

    get path() {
        return this._path
    }

    set path(path: string) {
        this._path = path
    }

    toString() {
        return this._path
    }

    toJSON() {
        return this._path
    }

}
