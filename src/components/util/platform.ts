
export enum OS { WINDOWS = 'windows', LINUX = 'linux', OSX = 'osx' } // mojang friendly OS

export interface IPlatform {
    arch: string
    name: OS
    version: string
}

import * as _os from 'os'

export class Platform implements IPlatform {

    static getName(): OS {
        const _platform = _os.platform()
        {
            switch (_platform) {
                case 'win32': {
                    return OS.WINDOWS
                }
                case 'darwin': {
                    return OS.OSX
                }
                default: {
                    return OS.LINUX
                } // linux and other (unknown)..
            }
        }
    }

    static getArch(): string { return _os.arch() }

    static getVersion(): string { return _os.release() }

    static getSeparator(os = currentPlatform.name): string {
        switch (os) {
            case OS.WINDOWS: return ';'
            default: return ':'
        }
    }

    constructor(
        readonly name = Platform.getName(),
        readonly arch = Platform.getArch(),
        readonly version = Platform.getVersion()
    ) { }

}

export const currentPlatform = new Platform()
