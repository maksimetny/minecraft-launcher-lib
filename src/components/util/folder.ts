
import { join } from 'path'

class Folder {

    constructor(private directory: string) { }

    getPathTo(...path: string[]) { return join(this.path, ...path) }

    get path() { return this.directory }

    setDirectory(directory: string) { this.directory = directory }

}

export class LauncherFolder extends Folder {

    static from(location: LauncherLocation) { return location instanceof LauncherFolder ? location : new LauncherFolder(location) }

    constructor(directory: string) { super(directory) }

    get natives() {
        return this.getPathTo('natives')
    }

    get libraries() {
        return this.getPathTo('libraries')
    }

    getLibraryPath(libraryPath: string) {
        return join(this.libraries, libraryPath)
    }

} // launcher disposition

export type LauncherLocation = LauncherFolder | /* or */ string
