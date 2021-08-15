
import {
    join,
} from 'path';

import {
    Folder,
} from '../../folder';

export class LauncherFolder extends Folder {

    static from(location: LauncherLocation): LauncherFolder { return location instanceof LauncherFolder ? location : new LauncherFolder(location); }

    constructor(_path: string) { super(_path); }

    get natives(): string {
        return this.getPathTo('natives');
    }

    get libs(): string {
        return this.getPathTo('libraries');
    }

    get libraries(): string {
        return this.libs;
    }

    getLibraryPath(relativeLibraryPath: string): string {
        return join(this.libs, relativeLibraryPath);
    }

}

export type LauncherLocation = LauncherFolder | string;
