
export enum OS {
    WINDOWS = 'windows',
    LINUX = 'linux',
    OSX = 'osx',
} // mojang friendly OS

export interface IPlatform {
    arch: string
    name: OS
    version: string
}

import * as os from 'os'

export class Platform implements IPlatform {

    static from(_platform: Partial<IPlatform>) {
        if (_platform instanceof Platform) {
            return _platform
        }

        const {
            name = currentPlatform.name,
            arch = currentPlatform.arch,
            version = currentPlatform.version,
        } = _platform

        return new Platform(
            name,
            arch,
            version,
        )
    }

    static get currentPlatform() {
        if (currentPlatform) {
            return currentPlatform
        }

        const name: OS = (() => {
            switch (os.platform()) {
                case 'win32': {
                    return OS.WINDOWS
                }
                case 'darwin': {
                    return OS.OSX
                }
                default: {
                    return OS.LINUX
                } // linux and unknown
            }
        })()
        const arch: string = os.arch()
        const version: string = os.release()

        return new Platform(
            name,
            arch,
            version,
        )
    }

    constructor(
        private _name: OS,
        private _arch: string,
        private _version: string,
    ) { }

    get name() {
        return this._name
    }

    set name(name) {
        this._name = name
    }

    get arch() {
        return this._arch
    }

    set arch(arch) {
        this._arch = arch
    }

    get version() { return this._version }

    set version(version) { this._version = version }

    get classpathSeparator(): string {
        switch (this._name) {
            case OS.WINDOWS: {
                return ';'
            }
            default: {
                return ':'
            }
        }
    }

    toJSON(): IPlatform {
        const {
            name,
            arch,
            version,
        } = this

        return {
            name,
            arch,
            version,
        }
    }

}

export const currentPlatform: Platform = Platform.currentPlatform
