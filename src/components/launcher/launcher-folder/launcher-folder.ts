
import { join } from 'path';
import { Folder, IFolder } from '../../folder';

export interface ILauncherFolder extends IFolder {
    root: string;
    game: string;
    assets: string;
    natives: string;
    versions: string;
    libraries: string;
}

export class LauncherFolder extends Folder implements ILauncherFolder {

    static from(launcherLocation: LauncherLocation): LauncherFolder {
        if (launcherLocation instanceof LauncherFolder) return launcherLocation;
        else if (typeof launcherLocation !== 'string') {
            throw new Error('launcher location is not string');
        }

        return new LauncherFolder(launcherLocation);
    }

    constructor(
        root: string,
        public overrides: Partial<Omit<ILauncherFolder, 'root'>> = {},
    ) {
        super(root);
    }

    get game(): string {
        return this.overrides.game || this.root;
    }

    set game(game: string) {
        this.overrides.game = game;
    }

    /**
     * The assets directory,
     */
    get assets(): string {
        return this.overrides.assets || this.join('assets');
    }

    set assets(assets: string) {
        this.overrides.assets = assets;
    }

    /**
     * The native libraries directory.
     */
    get natives(): string {
        return this.overrides.natives || this.join('natives');
    }

    set natives(natives: string) {
        this.overrides.natives = natives;
    }

    get versions(): string {
        return this.overrides.versions || this.join('versions');
    }

    set versions(versions: string) {
        this.overrides.versions = versions;
    }

    /**
     * The libraries directory.
     */
    get libraries(): string {
        return this.overrides.libraries || this.join('libraries');
    }

    set libraries(libraries: string) {
        this.overrides.libraries = libraries;
    }

    /**
     * The libraries directory.
     */
    get libs(): string {
        return this.libraries;
    }

    set libs(libs: string) {
        this.libraries = libs;
    }

    getLibraryPath(libraryPath: string): string {
        return join(this.libraries, libraryPath);
    }

    getVersionPath(versionId: string): string {
        return join(this.versions, versionId);
    }

    getNativesPath(versionId: string): string {
        return join(this.natives, versionId);
    }

}

export type LauncherLocation = string | Partial<ILauncherFolder>;
