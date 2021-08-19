
/** Mojang friendly OS name. */
export enum OS {
    WINDOWS = 'windows',
    LINUX = 'linux',
    OSX = 'osx',
}

export interface IPlatform {
    arch: string;
    name: OS;
    version: string;
}

import * as os from 'os';

export class Platform implements IPlatform {

    static from(platform: Partial<IPlatform>, def: Partial<IPlatform> = Platform.current): Platform {
        if (platform instanceof Platform) return platform;

        const {
            version = def.version,
            name = def.name,
            arch = def.arch,
        } = platform;

        return new Platform(
            name,
            arch,
            version,
        );
    }

    static get current(): Platform {
        return Platform._current ? Platform._current : Platform._current = new Platform();
    }

    private static _current: Platform;

    private _arch: string;
    private _name: OS;
    private _version: string;

    constructor(
        name?: OS,
        arch?: string,
        version?: string,
    ) {
        if (!name) {
            switch (os.platform()) {
                case 'win32': {
                    name = OS.WINDOWS;
                    break;
                }
                case 'darwin': {
                    name = OS.OSX;
                    break;
                }
                default: {
                    name = OS.LINUX;
                    break;
                } // linux and unknown
            }
        }

        this._version = version ? version : os.release();
        this._name = name;
        this._arch = arch ? arch : os.arch();
    }

    get name(): OS {
        return this._name;
    }

    set name(name: OS) {
        this._name = name;
    }

    get arch(): string {
        return this._arch;
    }

    set arch(arch: string) {
        this._arch = arch;
    }

    get version(): string { return this._version; }

    set version(version: string) { this._version = version; }

    get classpathSeparator(): string {
        switch (this._name) {
            case OS.WINDOWS: return ';';
            default: return ':';
        }
    }

    toJSON(): IPlatform {
        const {
            name,
            arch,
            version,
        } = this;
        return {
            name,
            arch,
            version,
        };
    }

}
