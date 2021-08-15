
import {
    join,
} from 'path'

import {
    Folder,
} from '../../folder'

export class LauncherFolder extends Folder {

    static from(location: LauncherLocation) { return location instanceof LauncherFolder ? location : new LauncherFolder(location) }

    constructor(_path: string) { super(_path) }

    get natives() {
        return this.getPathTo('natives')
    }

    get libs() {
        return this.getPathTo('libraries')
    }

    get libraries() {
        return this.libs
    }

    getLibraryPath(relativeLibraryPath: string) {
        return join(this.libs, relativeLibraryPath)
    }

}

export type LauncherLocation = LauncherFolder | string
