
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

import * as _os from 'os'

export class Platform implements IPlatform {

    static get currentName(): OS {
        switch (_os.platform()) {
            case 'win32': {
                return OS.WINDOWS
            }
            case 'darwin': {
                return OS.OSX
            }
            default: {
                return OS.LINUX
            } // linux and other (unknown)
        }
    }

    static get currentArch(): string { return _os.arch() }

    static get currentVersion(): string { return _os.release() }

    static getClasspathSeparator(os = Platform.currentName): string {
        switch (os) {
            case OS.WINDOWS: return ';'
            default: return ':'
        }
    }

    constructor(
        readonly name = Platform.currentName,
        readonly arch = Platform.currentArch,
        readonly version = Platform.currentVersion,
    ) { }

}

export const currentPlatform = new Platform()
